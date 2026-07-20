import { useState, useRef } from "react";
import axios from "axios";
import api from "@/api/axios";
import { toast } from "sonner";
import { Upload, AlertCircle, CheckCircle, RefreshCw, Loader2 } from "lucide-react";
import { compressImageToMax20KB } from "@/lib/imageCompression";

export default function PhotoUploader({ projectId, folderId, onUploadComplete }) {
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
  const folderInputRef = useRef(null);

  const filterImageFiles = (files) => {
    return files.filter(
      (file) =>
        file.type.startsWith("image/") ||
        /\.(jpe?g|png|webp|gif)$/i.test(file.name)
    );
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const images = filterImageFiles(files);
    if (images.length > 0) {
      setSelectedFiles(images);
      setFailedList([]);
      setProgress({ completed: 0, total: images.length, success: 0, failed: 0 });
    } else if (files.length > 0) {
      toast.error("No valid image files selected.");
    }
  };

  const handleFolderChange = (e) => {
    const files = Array.from(e.target.files || []);
    const images = filterImageFiles(files);
    if (images.length > 0) {
      setSelectedFiles(images);
      setFailedList([]);
      setProgress({ completed: 0, total: images.length, success: 0, failed: 0 });
    } else if (files.length > 0) {
      toast.error("No valid images found in the selected folder.");
    }
  };

  const getTargetFolderName = (file) => {
    if (folderId) return null;
    if (!file.webkitRelativePath) return "General";
    const parts = file.webkitRelativePath.split("/");
    if (parts.length > 2) {
      return parts[1]; // e.g. "Wedding/Haldi/photo.jpg" -> "Haldi"
    } else if (parts.length === 2) {
      return parts[0]; // e.g. "Wedding/photo.jpg" -> "Wedding"
    }
    return "General";
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

  const startUpload = async (items) => {
    if (items.length === 0) return;
    setUploading(true);
    setFailedList([]);

    try {
      // 1. Resolve flat upload queue with correct folder IDs
      const uploadQueue = [];
      const rawFiles = [];

      items.forEach((item) => {
        if (item.file && item.folderId) {
          uploadQueue.push(item);
        } else {
          rawFiles.push(item);
        }
      });

      if (rawFiles.length > 0) {
        if (folderId) {
          rawFiles.forEach((file) => {
            uploadQueue.push({ file, folderId });
          });
        } else {
          // Group by target folder name
          const filesByFolderName = {};
          rawFiles.forEach((file) => {
            const fName = getTargetFolderName(file) || "General";
            if (!filesByFolderName[fName]) {
              filesByFolderName[fName] = [];
            }
            filesByFolderName[fName].push(file);
          });

          // Fetch existing project folders
          const resFolders = await api.get(`/photo-selection/projects/${projectId}/folders`);
          const existingFolders = resFolders.data?.folders || [];

          const folderMap = {};
          const folderNames = Object.keys(filesByFolderName);

          // Resolve folders sequentially to prevent race conditions
          for (const name of folderNames) {
            const existing = existingFolders.find(
              (f) => f.folderName.toLowerCase() === name.toLowerCase()
            );
            if (existing) {
              folderMap[name] = existing._id;
            } else {
              try {
                const createRes = await api.post(`/photo-selection/projects/${projectId}/folders`, {
                  folderName: name,
                });
                if (createRes.data?.success) {
                  folderMap[name] = createRes.data.folder._id;
                }
              } catch (err) {
                console.error(`Failed to create folder: ${name}`, err);
                if (existingFolders.length > 0) {
                  folderMap[name] = existingFolders[0]._id;
                }
              }
            }
          }

          // Map files to folder IDs
          Object.entries(filesByFolderName).forEach(([name, files]) => {
            const fId = folderMap[name];
            if (fId) {
              files.forEach((file) => {
                uploadQueue.push({ file, folderId: fId });
              });
            }
          });
        }
      }

      // Reset progress with the total queue length
      setProgress({ completed: 0, total: uploadQueue.length, success: 0, failed: 0 });

      // 2. Perform concurrent uploads (concurrency = 4)
      const results = [];
      const failures = [];
      let index = 0;
      let completedCount = 0;
      let successCount = 0;
      let failedCount = 0;

      // Cache signature details per folder ID
      const signatureCache = {};
      const getSignatureData = async (fId) => {
        if (signatureCache[fId]) return signatureCache[fId];
        const sigRes = await api.post("/photo-selection/cloudinary-signature", {
          projectId,
          folderId: fId,
        });
        if (!sigRes.data?.success) {
          throw new Error("Unable to retrieve upload signature");
        }
        signatureCache[fId] = sigRes.data;
        return sigRes.data;
      };

      const runNext = async () => {
        if (index >= uploadQueue.length) return;
        const currentIdx = index++;
        const item = uploadQueue[currentIdx];
        const { file, folderId: fileFolderId } = item;

        try {
          const signatureData = await getSignatureData(fileFolderId);
          const uploadedPhoto = await uploadFileDirect(file, signatureData);
          results.push({ ...uploadedPhoto, folderId: fileFolderId });
          successCount++;
        } catch (err) {
          console.error("Direct upload failed for", file.name, err);
          failures.push(item);
          failedCount++;
        } finally {
          completedCount++;
          setProgress((prev) => ({
            completed: completedCount,
            total: uploadQueue.length,
            success: successCount,
            failed: failedCount,
          }));
          await runNext();
        }
      };

      // Spawn concurrent workers
      const workers = [];
      const concurrency = Math.min(4, uploadQueue.length);
      for (let i = 0; i < concurrency; i++) {
        workers.push(runNext());
      }
      await Promise.all(workers);

      // 3. Save uploaded photos metadata in bulk to backend (grouped by folderId)
      if (results.length > 0) {
        const resultsByFolder = {};
        results.forEach((item) => {
          if (!resultsByFolder[item.folderId]) {
            resultsByFolder[item.folderId] = [];
          }
          resultsByFolder[item.folderId].push({
            originalFileName: item.originalFileName,
            originalBaseName: item.originalBaseName,
            previewUrl: item.previewUrl,
            cloudinaryPublicId: item.cloudinaryPublicId,
          });
        });

        for (const [fId, photosList] of Object.entries(resultsByFolder)) {
          const batchSize = 50;
          for (let i = 0; i < photosList.length; i += batchSize) {
            const batch = photosList.slice(i, i + batchSize);
            await api.post(`/photo-selection/projects/${projectId}/photos/bulk`, {
              photos: batch,
              folderId: fId,
            });
          }
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
      <h3 className="text-lg font-semibold text-black mb-4">
        {folderId ? "Upload Photos to Folder" : "Bulk Upload Folder"}
      </h3>

      {!uploading && progress.completed === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Option 1: Choose Photos */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-black/15 hover:border-black/30 hover:bg-black/[0.01] transition rounded-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center bg-black/2 group"
          >
            <div className="p-3 bg-white rounded-full border border-black/5 shadow-xs mb-3 group-hover:scale-105 transition-transform duration-200">
              <Upload className="h-6 w-6 text-black/70" />
            </div>
            <p className="text-sm font-bold text-black">Select Photos</p>
            <p className="text-xs text-black/50 mt-1 max-w-[200px] mx-auto">
              Select multiple photos from your local device.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Option 2: Choose Folder */}
          <div
            onClick={() => folderInputRef.current?.click()}
            className="border-2 border-dashed border-black/15 hover:border-black/30 hover:bg-black/[0.01] transition rounded-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center bg-black/2 group"
          >
            <div className="p-3 bg-white rounded-full border border-black/5 shadow-xs mb-3 group-hover:scale-105 transition-transform duration-200">
              <span className="text-2xl">📁</span>
            </div>
            <p className="text-sm font-bold text-black">Select Folder</p>
            <p className="text-xs text-black/50 mt-1 max-w-[200px] mx-auto">
              Choose a folder. Subfolders (Haldi, Mehndi, etc.) will be created.
            </p>
            <input
              type="file"
              ref={folderInputRef}
              onChange={handleFolderChange}
              webkitdirectory=""
              directory=""
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>
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
