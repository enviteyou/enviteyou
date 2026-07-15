import { useState, useRef } from "react";
import axios from "axios";
import api from "@/api/axios";
import { toast } from "sonner";
import { Upload, AlertCircle, CheckCircle, RefreshCw, Loader2 } from "lucide-react";
import { compressImageToMax20KB } from "@/lib/imageCompression";

export default function PhotoUploader({ projectId, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    success: 0,
    failed: 0,
  });
  const [failedList, setFailedList] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      setFailedList([]);
      setProgress({ completed: 0, total: files.length, success: 0, failed: 0 });
    }
  };

  const uploadFileDirect = async (file, signatureData) => {
    const { signature, timestamp, apiKey, cloudName, folder } = signatureData;
    
    // Compress the photo to max 20kb client-side before upload
    const compressedFile = await compressImageToMax20KB(file);

    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    return {
      originalFileName: file.name,
      originalBaseName: file.name.substring(0, file.name.lastIndexOf(".")) || file.name,
      previewUrl: res.data.secure_url,
      cloudinaryPublicId: res.data.public_id,
    };
  };

  const startUpload = async (filesToUpload) => {
    if (filesToUpload.length === 0) return;
    setUploading(true);
    setFailedList([]);

    try {
      // 1. Fetch Cloudinary signature from backend
      const sigRes = await api.post("/photo-selection/cloudinary-signature");
      if (!sigRes.data?.success) {
        throw new Error("Unable to retrieve upload signature");
      }
      const signatureData = sigRes.data;

      // 2. Perform concurrent uploads (concurrency = 4)
      const results = [];
      const failures = [];
      let index = 0;
      let completedCount = 0;
      let successCount = progress.success;
      let failedCount = 0;

      const runNext = async () => {
        if (index >= filesToUpload.length) return;
        const currentIdx = index++;
        const file = filesToUpload[currentIdx];

        try {
          const uploadedPhoto = await uploadFileDirect(file, signatureData);
          results.push(uploadedPhoto);
          successCount++;
        } catch (err) {
          console.error("Direct upload failed for", file.name, err);
          failures.push(file);
          failedCount++;
        } finally {
          completedCount++;
          setProgress((prev) => ({
            completed: completedCount,
            total: filesToUpload.length,
            success: successCount,
            failed: failedCount,
          }));
          await runNext();
        }
      };

      // Spawn concurrent workers
      const workers = [];
      const concurrency = Math.min(4, filesToUpload.length);
      for (let i = 0; i < concurrency; i++) {
        workers.push(runNext());
      }
      await Promise.all(workers);

      // 3. Save uploaded photos metadata in bulk to backend (in batches of 50)
      if (results.length > 0) {
        const batchSize = 50;
        for (let i = 0; i < results.length; i += batchSize) {
          const batch = results.slice(i, i + batchSize);
          await api.post(`/photo-selection/projects/${projectId}/photos/bulk`, { photos: batch });
        }
      }

      setFailedList(failures);
      if (failures.length === 0) {
        toast.success(`Successfully uploaded all ${results.length} photos!`);
        setSelectedFiles([]);
        if (onUploadComplete) onUploadComplete();
      } else {
        toast.warning(`Uploaded ${results.length} photos. ${failures.length} failed.`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message || "Upload process encountered an error.");
    } finally {
      setUploading(false);
    }
  };

  const handleRetryFailed = () => {
    const list = [...failedList];
    setProgress({ completed: 0, total: list.length, success: progress.success, failed: 0 });
    startUpload(list);
  };

  const percent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-black mb-4">Upload Preview Photos</h3>

      {!uploading && progress.completed === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-black/15 hover:border-black/30 transition rounded-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center bg-black/2"
        >
          <Upload className="h-8 w-8 text-black/45 mb-3" />
          <p className="text-sm font-semibold text-black">Click to select photos</p>
          <p className="text-xs text-black/50 mt-1">Select compressed/preview photos (JPG, PNG, WebP)</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
        </div>
      )}

      {selectedFiles.length > 0 && !uploading && progress.completed === 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-black">
            Selected {selectedFiles.length} photos ready for upload.
          </p>
          <button
            onClick={() => startUpload(selectedFiles)}
            className="mt-3 w-full bg-black hover:bg-black/90 text-white font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer"
          >
            Start Upload
          </button>
        </div>
      )}

      {uploading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-black">Uploading Photos</span>
            <span className="text-black/60 font-medium">
              {progress.completed} / {progress.total}
            </span>
          </div>

          <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-black/60 font-medium">
            <span>{percent}% Complete</span>
            <span className="flex items-center gap-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Batch uploading...
            </span>
          </div>
        </div>
      )}

      {progress.completed > 0 && !uploading && (
        <div className="space-y-4">
          <div className="rounded-xl bg-black/2 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/60 font-medium">Successfully Uploaded:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> {progress.success}
              </span>
            </div>
            {progress.failed > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-black/60 font-medium">Failed:</span>
                <span className="font-semibold text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {progress.failed}
                </span>
              </div>
            )}
          </div>

          {failedList.length > 0 ? (
            <button
              onClick={handleRetryFailed}
              className="w-full flex items-center justify-center gap-2 border border-black/15 hover:bg-black/2 bg-white text-black font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" /> Retry Failed Uploads ({failedList.length})
            </button>
          ) : (
            <button
              onClick={() => setProgress({ completed: 0, total: 0, success: 0, failed: 0 })}
              className="w-full border border-black/10 hover:bg-black/2 text-black font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer"
            >
              Upload More Photos
            </button>
          )}
        </div>
      )}
    </div>
  );
}
