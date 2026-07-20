"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/api/axios";
import { toast } from "sonner";
import { Check, Eye, CheckCircle, AlertTriangle, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import PhotoViewerModal from "./PhotoViewerModal";

// Helper to inject Cloudinary optimization parameters
const getCloudinaryThumbnail = (url) => {
  if (!url) return "";
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/w_320,h_320,c_fill,q_auto,f_auto/");
};

export default function ClientGallery({ token }) {
  const [project, setProject] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Folder states
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedFolderName, setSelectedFolderName] = useState("");
  const [viewSelectedOnly, setViewSelectedOnly] = useState(false); // Toggle to filter selected photos

  // Lightbox viewer state
  const [viewerIndex, setViewerIndex] = useState(null);

  const observerRef = useRef(null);

  // Fetch folders list
  const fetchFoldersList = async () => {
    try {
      setLoadingFolders(true);
      const res = await api.get(`/photo-selection/client/project/${token}/folders`);
      if (res.data?.success) {
        setFolders(res.data.folders || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load events.");
    } finally {
      setLoadingFolders(false);
    }
  };

  // 1. Load project details and folders on mount
  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        const res = await api.get(`/photo-selection/client/project/${token}`);
        if (res.data?.success) {
          const projectData = res.data.project;
          setProject(projectData);

          // Restore selection from DB as single source of truth for multi-device sync
          setSelectedIds(projectData.selectedPhotoIds || []);

          if (projectData.status === "completed") {
            setSubmitSuccess(true);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Invalid or expired selection link.");
      } finally {
        setLoading(false);
      }
    }
    loadProject();
    fetchFoldersList();
  }, [token]);

  // 2. Fetch photos in paginated pages
  const fetchPhotos = async (pageNum, reset = false, customSelectedOnly = null) => {
    const isSelectedOnly = customSelectedOnly !== null ? customSelectedOnly : viewSelectedOnly;
    if (!selectedFolderId && !isSelectedOnly) return;
    try {
      setLoadingMore(true);
      const url = isSelectedOnly
        ? `/photo-selection/client/project/${token}/photos?onlySelected=true&page=${pageNum}&limit=60`
        : `/photo-selection/client/project/${token}/photos?folderId=${selectedFolderId}&page=${pageNum}&limit=60`;
      const res = await api.get(url);
      if (res.data?.success) {
        const newPhotos = res.data.photos;
        setPhotos((prev) => (reset ? newPhotos : [...prev, ...newPhotos]));
        setHasMore(newPhotos.length === 60);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load photos.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Fetch photos when selectedFolderId or viewSelectedOnly changes
  useEffect(() => {
    if (project) {
      setPage(1);
      setPhotos([]);
      setHasMore(true);
      fetchPhotos(1, true);
    }
  }, [project, selectedFolderId, viewSelectedOnly]);

  // 3. Selection toggler with real-time DB sync
  const handleToggleSelect = async (photo) => {
    if (submitSuccess) return;

    let nextIds = [];
    const isSelected = selectedIds.includes(photo._id);
    if (isSelected) {
      nextIds = selectedIds.filter((id) => id !== photo._id);
    } else {
      nextIds = [...selectedIds, photo._id];
      if (nextIds.length > project.selectionLimit && project.enableLimitAlert) {
        toast.warning(`You have exceeded the recommended selection limit of ${project.selectionLimit} photos.`);
      }
    }

    setSelectedIds(nextIds);

    // Save selection progress to database in real-time
    try {
      await api.post(`/photo-selection/client/project/${token}/save-progress`, {
        selectedPhotoIds: nextIds,
      });
    } catch (err) {
      console.error("Failed to save selection progress", err);
      toast.error("Network issue. Selection not synced to server.");
    }
  };

  // 4. Infinite scroll intersection observer trigger
  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loadingMore && !loading && (selectedFolderId || viewSelectedOnly)) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPhotos(nextPage);
    }
  };

  useEffect(() => {
    const option = { root: null, rootMargin: "200px", threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [photos, hasMore, loadingMore, loading, page, selectedFolderId, viewSelectedOnly]);

  // 5. Submit selection to MongoDB
  const handleSubmitSelection = async () => {
    setSubmitting(true);
    setShowConfirmModal(false);

    try {
      const res = await api.post(`/photo-selection/client/project/${token}/submit`, {
        selectedPhotoIds: selectedIds,
      });

      if (res.data?.success) {
        setSubmitSuccess(true);
        toast.success("Your selection has been submitted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit selection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#fcfaf8] text-black">
        <Loader2 className="h-10 w-10 animate-spin text-[#7d2432] mb-4" />
        <p className="text-sm font-semibold tracking-wider uppercase text-black/55">Loading Album Preview...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#fcfaf8] text-black px-4 text-center">
        <AlertTriangle className="h-12 w-12 text-[#7d2432] mb-4" />
        <h2 className="text-xl font-bold">Invalid Project URL</h2>
        <p className="mt-2 text-sm text-black/55 leading-5 max-w-sm">
          This selection link is either broken, expired, or incorrect. Please ask your photographer to provide a valid link.
        </p>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#fcfaf8] text-black px-4 text-center">
        <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-md">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-black tracking-tight">{project.projectName}</h2>
        <p className="mt-2 text-sm text-black/55 leading-6 max-w-md">
          Thank you, <span className="font-semibold text-black">{project.clientName}</span>! Your photo selection has been finalized and sent to your photographer.
        </p>
        <p className="text-xs text-black/40 mt-6 uppercase tracking-wider font-semibold">
          Selected: {selectedIds.length} / {project.selectionLimit} Photos
        </p>
      </div>
    );
  }

  // EVENT SELECTION SCREEN (rendered if no folder has been selected yet)
  if (!selectedFolderId && !viewSelectedOnly) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] text-black flex flex-col font-sans">
        {/* Header */}
        <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-6 py-4.5 z-40 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-black flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#c8a24c] animate-pulse" /> {project.projectName}
            </h1>
            <p className="text-[10px] text-black/45 uppercase tracking-[0.2em] font-semibold mt-0.5">
              Client: {project.clientName}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewSelectedOnly(!viewSelectedOnly)}
              className={`rounded px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${viewSelectedOnly
                ? "bg-[#c8a24c] text-white"
                : "bg-black/5 hover:bg-black/10 text-black/75"
                } cursor-pointer`}
            >
              {viewSelectedOnly ? "Show All Photos" : `Show Selected (${selectedIds.length})`}
            </button>

            <div className="text-right">
              <p className="text-sm font-bold text-black">
                {selectedIds.length} / {project.selectionLimit}
              </p>
              <p className="text-[9px] text-black/45 uppercase tracking-wider font-semibold">Selected Photos</p>
            </div>
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={selectedIds.length === 0}
              className="rounded bg-black hover:bg-black/90 disabled:bg-black/10 text-white disabled:text-black/30 px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition duration-300 shadow-md cursor-pointer"
            >
              Submit Selection
            </button>
          </div>
        </header>

        {/* Welcome Section */}
        <div className="max-w-7xl w-full mx-auto px-6 mt-8">
          <div className="rounded border border-black/10 bg-linear-to-r from-white to-[#fdf9ef]/70 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif text-black italic">Hello, {project.clientName}</h2>
              <p className="text-sm text-black/60 max-w-2xl leading-relaxed">
                Welcome to your invitation album workspace. Please select up to <span className="font-bold text-black">{project.selectionLimit}</span> of your favorite photos for your wedding album. Choose an event folder below to start selecting photos.
              </p>
            </div>
            <div className="flex flex-col gap-1 w-full md:w-auto shrink-0 bg-white border border-black/10 rounded p-4 shadow-sm min-w-[220px]">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-black/60">
                <span>Selected</span>
                <span>{selectedIds.length} / {project.selectionLimit}</span>
              </div>
              <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full transition-all duration-500 ${selectedIds.length > project.selectionLimit ? 'bg-amber-500' : selectedIds.length === project.selectionLimit ? 'bg-emerald-500' : 'bg-black'}`}
                  style={{ width: `${Math.min((selectedIds.length / project.selectionLimit) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-black/40 mt-1.5 text-right font-medium">
                {selectedIds.length > project.selectionLimit ? `${selectedIds.length - project.selectionLimit} over limit` : `${project.selectionLimit - selectedIds.length} photos remaining`}
              </p>
            </div>
          </div>
        </div>

        {/* Choose Event Main Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
          <h2 className="text-2xl font-serif italic text-black mb-6">Choose Event Folder</h2>

          {loadingFolders ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#7d2432]" />
            </div>
          ) : folders.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-black/10 rounded bg-white shadow-xs">
              <p className="text-black/55 text-sm font-medium">No event folders available for this project.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {folders.map((folder) => (
                <button
                  key={folder._id}
                  onClick={() => {
                    setSelectedFolderId(folder._id);
                    setSelectedFolderName(folder.folderName);
                  }}
                  className="group rounded border border-black/8 hover:border-black bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition text-left cursor-pointer flex flex-col justify-between h-44"
                >
                  <span className="text-4xl group-hover:scale-110 transition duration-300 transform origin-left">📁</span>
                  <div>
                    <h3 className="text-xl font-bold text-black mt-4 truncate">{folder.folderName}</h3>
                    <p className="text-xs text-black/45 font-semibold mt-1 uppercase tracking-wider">{folder.totalPhotos || 0} Photos</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // EVENT PHOTOS GALLERY VIEW
  return (
    <div className="min-h-screen bg-[#fcfaf8] text-black flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-6 py-4.5 z-40 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (viewSelectedOnly) {
                setViewSelectedOnly(false);
              } else {
                setSelectedFolderId(null);
                setSelectedFolderName("");
                setPhotos([]);
                fetchFoldersList(); // Refresh photo counts on folders when going back
              }
            }}
            className="p-2 hover:bg-black/5 rounded-full border border-black/10 transition cursor-pointer"
            title={viewSelectedOnly ? "Show All Photos" : "Back to Event Folders"}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-black flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#c8a24c]" /> {project.projectName} - {viewSelectedOnly ? "Selected Photos" : selectedFolderName}
            </h1>
            <p className="text-[10px] text-black/45 uppercase tracking-[0.2em] font-semibold mt-0.5">
              Client: {project.clientName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewSelectedOnly(!viewSelectedOnly)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${viewSelectedOnly
              ? "bg-[#c8a24c] text-white"
              : "bg-black/5 hover:bg-black/10 text-black/75"
              } cursor-pointer`}
          >
            {viewSelectedOnly ? "Show All Photos" : `Show Selected (${selectedIds.length})`}
          </button>

          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-black">
              {selectedIds.length} / {project.selectionLimit}
            </p>
            <p className="text-[9px] text-black/45 uppercase tracking-wider font-semibold">Selected Photos</p>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={selectedIds.length === 0}
            className="rounded-full bg-black hover:bg-black/90 disabled:bg-black/10 text-white disabled:text-black/30 px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition duration-300 shadow-md hover:scale-[1.02] active:scale-95 disabled:pointer-events-none cursor-pointer"
          >
            Submit Selection
          </button>
        </div>
      </header>

      {/* Floating Sticky Mobile Counter */}
      <div className="sm:hidden sticky top-[68px] w-full bg-[#f6f3ef]/90 backdrop-blur-md border-b border-black/5 py-2.5 px-6 flex justify-between items-center z-30">
        <span className="text-[10px] font-bold uppercase tracking-wider text-black/55">Selection Progress</span>
        <span className="text-xs font-bold text-black">
          {selectedIds.length} / {project.selectionLimit}
        </span>
      </div>

      {/* Top Welcome Dashboard banner */}
      <div className="max-w-7xl w-full mx-auto px-6 mt-8">
        <div className="rounded-3xl border border-black/10 bg-linear-to-r from-white to-[#fdf9ef]/70 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif text-black italic">
              {viewSelectedOnly ? "Your Selection Workspace" : `${selectedFolderName} Workspace`}
            </h2>
            <p className="text-sm text-black/60 max-w-2xl leading-relaxed">
              {viewSelectedOnly
                ? "Viewing all your selected photos across all folders. Review your choices here before submitting. Toggling off selection on any photo will remove it from the list."
                : `Viewing preview photos for the ${selectedFolderName} event. Hover over any image to toggle selection or open fullscreen preview. Click the back arrow in the header to view other event folders.`}
            </p>
          </div>
          <div className="flex flex-col gap-1 w-full md:w-auto shrink-0 bg-white border border-black/10 rounded-2xl p-4 shadow-sm min-w-[220px]">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-black/60">
              <span>Selected</span>
              <span>{selectedIds.length} / {project.selectionLimit}</span>
            </div>
            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full transition-all duration-500 ${selectedIds.length > project.selectionLimit ? 'bg-amber-500' : selectedIds.length === project.selectionLimit ? 'bg-emerald-500' : 'bg-black'}`}
                style={{ width: `${Math.min((selectedIds.length / project.selectionLimit) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-black/40 mt-1.5 text-right font-medium">
              {selectedIds.length > project.selectionLimit ? `${selectedIds.length - project.selectionLimit} over limit` : `${project.selectionLimit - selectedIds.length} photos remaining`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {photos.length === 0 && !loadingMore ? (
          <div className="text-center py-24 border border-dashed border-black/10 rounded-3xl bg-white shadow-xs">
            <p className="text-black/55 text-sm font-medium">
              {viewSelectedOnly ? "You haven't selected any photos yet." : "No photos uploaded to this folder yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {photos.map((photo, index) => {
              const isSelected = selectedIds.includes(photo._id);
              const thumbUrl = getCloudinaryThumbnail(photo.previewUrl);

              return (
                <div
                  key={photo._id}
                  onClick={() => handleToggleSelect(photo)}
                  className={`group relative aspect-square rounded-2xl overflow-hidden bg-black/5 border transition duration-300 cursor-pointer ${isSelected ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-md" : "border-black/8 hover:border-black/15 shadow-xs"
                    }`}
                >
                  <img
                    src={thumbUrl}
                    alt={photo.originalFileName}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105 pointer-events-none"
                  />

                  {/* Dynamic Hover Action Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-between p-3.5 pointer-events-none">
                    <div className="flex justify-end w-full">
                      <div
                        className={`h-7 w-7 rounded-full border shadow-md flex items-center justify-center transition ${isSelected
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-white/90 border-black/10 text-transparent"
                          }`}
                      >
                        <Check className="h-4.5 w-4.5" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-full">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewerIndex(index);
                        }}
                        className="pointer-events-auto p-2 rounded-full bg-white/90 hover:bg-white text-black shadow-md transition duration-200 hover:scale-105 cursor-pointer flex items-center justify-center"
                        title="Preview Photo"
                      >
                        <Eye className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Static Selection badge check */}
                  {isSelected && (
                    <div className="absolute top-3.5 right-3.5 h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md border border-emerald-500 group-hover:hidden transition">
                      <Check className="h-4.5 w-4.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Load More trigger element */}
        <div ref={observerRef} className="h-14 mt-8 flex justify-center items-center">
          {loadingMore && (
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-black/50">
              <Loader2 className="h-4.5 w-4.5 animate-spin" /> Loading photos...
            </div>
          )}
        </div>
      </main>

      {/* Slideshow Lightbox Viewer */}
      {viewerIndex !== null && (
        <PhotoViewerModal
          photos={photos}
          currentIndex={viewerIndex}
          selectedPhotoIds={selectedIds}
          onClose={() => setViewerIndex(null)}
          onNavigate={(idx) => setViewerIndex(idx)}
          onSelectToggle={handleToggleSelect}
        />
      )}

      {/* Submit Confirmation Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
          <div className="w-full max-w-sm rounded-3xl border border-black/10 bg-white p-6.5 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-black mb-4">
              <Sparkles className="h-5 w-5 animate-pulse text-[#c8a24c]" />
            </div>
            <h3 className="text-lg font-bold text-black">Confirm Selection</h3>
            <p className="mt-2 text-sm text-black/55 leading-6">
              You selected <span className="font-bold text-black">{selectedIds.length}</span> photos. After submitting, your photographer will receive your selection and finalize your album.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="border border-black/10 hover:bg-black/2 font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitSelection}
                disabled={submitting}
                className="bg-black hover:bg-black/90 disabled:bg-black/40 text-white font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer uppercase tracking-wider"
              >
                {submitting ? "Submitting..." : "Confirm & Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
