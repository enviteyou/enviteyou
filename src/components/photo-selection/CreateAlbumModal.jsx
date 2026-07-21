"use client";

import { useState, useRef } from "react";
import api from "@/api/axios";
import { toast } from "sonner";
import { BookOpen, X, Copy, ExternalLink, Loader2, Sparkles, Check, Upload, Image as ImageIcon, FolderOpen } from "lucide-react";
import { compressImageToMax20KB } from "@/lib/imageCompression";

export default function CreateAlbumModal({ project, onClose, onAlbumCreated }) {
  const [albumTitle, setAlbumTitle] = useState(
    project ? `${project.projectName} Digital Album` : "Wedding Album"
  );
  const [clientName, setClientName] = useState(project?.clientName || "");
  const [useSelectedPhotos, setUseSelectedPhotos] = useState(true);
  const [theme, setTheme] = useState("classic");
  const [submitting, setSubmitting] = useState(false);
  const [createdAlbum, setCreatedAlbum] = useState(null);

  // Optional custom photos upload state
  const [customPhotos, setCustomPhotos] = useState([]);
  const [uploadingCustom, setUploadingCustom] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ completed: 0, total: 0 });

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const getFolderNameFromPath = (file) => {
    if (!file.webkitRelativePath) return "Uploaded Photos";
    const parts = file.webkitRelativePath.split("/");
    if (parts.length > 2) {
      return parts[parts.length - 2]; // e.g. "Event/Haldi/photo.jpg" -> "Haldi"
    } else if (parts.length === 2) {
      return parts[0]; // e.g. "Engagement/photo.jpg" -> "Engagement"
    }
    return "Uploaded Photos";
  };

  const handleCustomUpload = async (e) => {
    const rawFiles = Array.from(e.target.files || []);
    if (rawFiles.length === 0) return;

    // Filter image files only
    const imageFiles = rawFiles.filter(
      (file) => file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(file.name)
    );

    if (imageFiles.length === 0) {
      toast.error("No valid image files found in selection.");
      return;
    }

    setUploadingCustom(true);
    setUploadProgress({ completed: 0, total: imageFiles.length });

    try {
      // Fetch Cloudinary signature from API
      const sigRes = await api.post("/photo-selection/cloudinary-signature", {});
      const { signature, timestamp, cloudName, apiKey, folder } = sigRes.data;

      const uploadedList = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];

        try {
          // Compress photo before uploading for fast performance
          const compressedFile = await compressImageToMax20KB(file);

          const formData = new FormData();
          formData.append("file", compressedFile);
          formData.append("api_key", apiKey);
          formData.append("timestamp", timestamp);
          formData.append("signature", signature);
          formData.append("folder", folder);

          const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
          const res = await fetch(uploadUrl, { method: "POST", body: formData });
          const data = await res.json();

          if (data.secure_url) {
            uploadedList.push({
              url: data.secure_url,
              originalFileName: file.name,
              folderName: getFolderNameFromPath(file),
              caption: file.name.substring(0, file.name.lastIndexOf(".")) || file.name,
            });
          }
        } catch (fileErr) {
          console.error("Failed to upload photo:", file.name, fileErr);
        }

        setUploadProgress({ completed: i + 1, total: imageFiles.length });
      }

      setCustomPhotos((prev) => [...prev, ...uploadedList]);
      toast.success(`${uploadedList.length} photo(s) uploaded successfully!`);
    } catch (err) {
      console.error("Upload error", err);
      toast.error("Failed to upload custom photos.");
    } finally {
      setUploadingCustom(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (folderInputRef.current) folderInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!albumTitle.trim() || !clientName.trim()) {
      toast.error("Please provide both Album Title and Client Name.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        projectId: project?._id || null,
        albumTitle: albumTitle.trim(),
        clientName: clientName.trim(),
        useSelectedPhotos,
        theme,
        photos: useSelectedPhotos ? [] : customPhotos,
      };

      const res = await api.post("/album", payload);

      if (res.data?.success) {
        toast.success("Digital Album created successfully!");
        setCreatedAlbum(res.data.album);
        if (onAlbumCreated) onAlbumCreated(res.data.album);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create digital album.");
    } finally {
      setSubmitting(false);
    }
  };

  const albumLink = createdAlbum
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/album/${createdAlbum.albumToken}`
    : "";

  const handleCopyLink = () => {
    if (albumLink) {
      navigator.clipboard.writeText(albumLink);
      toast.success("Album link copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-black/10 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/45 hover:text-black transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {!createdAlbum ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5efe0] text-[#b7882f]">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-black">Create Digital Photo Album</h2>
                <p className="text-xs text-black/55 font-medium">Generate an interactive 3D flipbook album</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-black/75 mb-1 uppercase tracking-wider">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-[#f8f9fc] px-4 py-2.5 text-sm text-black outline-none transition focus:border-black"
                  placeholder="e.g. Rahul &amp; Ananya Wedding Album"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/75 mb-1 uppercase tracking-wider">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-[#f8f9fc] px-4 py-2.5 text-sm text-black outline-none transition focus:border-black"
                  placeholder="e.g. Rahul &amp; Ananya"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/75 mb-2 uppercase tracking-wider">
                  Photos Source
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUseSelectedPhotos(true)}
                    className={`rounded-2xl border p-3 text-left transition cursor-pointer ${
                      useSelectedPhotos
                        ? "border-black bg-black/5 text-black"
                        : "border-black/10 bg-white text-black/60 hover:border-black/30"
                    }`}
                  >
                    <Sparkles className="h-5 w-5 mb-1 text-amber-600" />
                    <p className="text-xs font-bold">Use Selected Photos</p>
                    <p className="text-[10px] text-black/50 mt-0.5">
                      Auto-pull {project?.selectedCount || 0} selected photos
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUseSelectedPhotos(false)}
                    className={`rounded-2xl border p-3 text-left transition cursor-pointer ${
                      !useSelectedPhotos
                        ? "border-black bg-black/5 text-black"
                        : "border-black/10 bg-white text-black/60 hover:border-black/30"
                    }`}
                  >
                    <Upload className="h-5 w-5 mb-1 text-emerald-600" />
                    <p className="text-xs font-bold">Upload Custom Photos</p>
                    <p className="text-[10px] text-black/50 mt-0.5">
                      Upload specific folder or photos
                    </p>
                  </button>
                </div>
              </div>

              {!useSelectedPhotos && (
                <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4 space-y-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-black">
                      <span>Total Uploaded: {customPhotos.length} photos</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingCustom}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-black/90 transition disabled:opacity-50"
                      >
                        <ImageIcon className="h-3.5 w-3.5" /> Upload Photos
                      </button>

                      <button
                        type="button"
                        onClick={() => folderInputRef.current?.click()}
                        disabled={uploadingCustom}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-black cursor-pointer hover:bg-black/5 transition disabled:opacity-50"
                      >
                        <FolderOpen className="h-3.5 w-3.5 text-amber-600" /> Upload Direct Folder
                      </button>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleCustomUpload}
                        className="hidden"
                      />

                      {/* Hidden Folder Input */}
                      <input
                        ref={folderInputRef}
                        type="file"
                        webkitdirectory=""
                        directory=""
                        multiple
                        onChange={handleCustomUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {uploadingCustom && (
                    <div className="flex items-center justify-between gap-2 text-xs text-black/70 bg-white p-2.5 rounded-xl border border-black/10">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-black" />
                        <span>Uploading photos &amp; folders...</span>
                      </div>
                      <span className="font-mono font-bold text-black">
                        {uploadProgress.completed} / {uploadProgress.total}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-black/75 mb-1 uppercase tracking-wider">
                  Album Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-[#f8f9fc] px-4 py-2.5 text-sm text-black outline-none transition focus:border-black cursor-pointer"
                >
                  <option value="classic">Royal Gold &amp; Classic Dark</option>
                  <option value="ivory">Ivory Rose &amp; Linen</option>
                  <option value="minimal">Modern Minimalist</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting || (!useSelectedPhotos && customPhotos.length === 0)}
                className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-black/90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating Album...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate Album &amp; Get Link
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">Digital Album Created!</h3>
              <p className="text-xs text-black/55 mt-1 font-medium">
                Share this interactive link with your client or view it live.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-[#f8f9fc] p-4 text-left">
              <p className="text-[10px] uppercase font-bold tracking-wider text-black/45 mb-1">Public Album Link</p>
              <div className="flex items-center justify-between gap-2 bg-white border border-black/10 rounded-xl px-3 py-2 text-xs font-mono text-black">
                <span className="truncate">{albumLink}</span>
                <button
                  onClick={handleCopyLink}
                  className="shrink-0 p-1.5 hover:bg-black/5 rounded-lg transition text-black/60 hover:text-black cursor-pointer"
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 rounded-xl border border-black/15 bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-black/5 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Copy className="h-4 w-4" /> Copy Link
              </button>

              <a
                href={albumLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-black py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/90 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="h-4 w-4" /> Open Album
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
