"use client";

import { useState, useEffect } from "react";
import api from "@/api/axios";
import { toast } from "sonner";
import {
  Camera,
  Plus,
  Copy,
  Check,
  Upload,
  FolderSync,
  ExternalLink,
  Loader2,
  Sparkles,
  Trash2,
  ArrowLeft,
  Edit3,
  FolderOpen,
  X,
  LayoutGrid,
  List,
  BookOpen
} from "lucide-react";
import PhotoUploader from "../photo-selection/PhotoUploader";
import LocalCopyModal from "../photo-selection/LocalCopyModal";
import CreateAlbumModal from "../photo-selection/CreateAlbumModal";

export default function PhotoSelectionManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states for creating project
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [enableLimitAlert, setEnableLimitAlert] = useState(true);
  const [selectionLimit, setSelectionLimit] = useState(100);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  // Active workspace state
  const [selectedProject, setSelectedProject] = useState(null);
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [activeUploadFolder, setActiveUploadFolder] = useState(null);
  const [showBulkUploader, setShowBulkUploader] = useState(false);
  const [selectionSummary, setSelectionSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Folder actions UI states
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState("");

  // Copy modal state
  const [activeCopyProjectId, setActiveCopyProjectId] = useState(null);
  const [activeCopyFolderName, setActiveCopyFolderName] = useState("");

  // Digital Album states
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [projectAlbums, setProjectAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/photo-selection/projects");
      if (res.data?.success) {
        setProjects(res.data.projects || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load photo selections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch folders for selected project
  const fetchFolders = async (projectId) => {
    try {
      setLoadingFolders(true);
      const res = await api.get(`/photo-selection/projects/${projectId}/folders`);
      if (res.data?.success) {
        setFolders(res.data.folders || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load folders.");
    } finally {
      setLoadingFolders(false);
    }
  };

  // Fetch selection summary for selected project
  const fetchSelectionSummary = async (projectId) => {
    try {
      setLoadingSummary(true);
      const res = await api.get(`/photo-selection/projects/${projectId}/selection-summary`);
      if (res.data?.success) {
        setSelectionSummary(res.data.summary || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load selection summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchProjectAlbums = async (projectId) => {
    try {
      setLoadingAlbums(true);
      const res = await api.get(`/album/project/${projectId}`);
      if (res.data?.success) {
        setProjectAlbums(res.data.albums || []);
      }
    } catch (err) {
      console.error("Failed to fetch project albums:", err);
    } finally {
      setLoadingAlbums(false);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm("Are you sure you want to delete this album?")) return;
    try {
      const res = await api.delete(`/album/${albumId}`);
      if (res.data?.success) {
        toast.success("Album deleted successfully.");
        if (selectedProject) fetchProjectAlbums(selectedProject._id);
      }
    } catch (err) {
      toast.error("Failed to delete album.");
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    fetchFolders(project._id);
    fetchProjectAlbums(project._id);
    if (project.status === "completed") {
      fetchSelectionSummary(project._id);
    } else {
      setSelectionSummary(null);
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setFolders([]);
    setProjectAlbums([]);
    setActiveUploadFolder(null);
    setShowBulkUploader(false);
    setSelectionSummary(null);
    fetchProjects();
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !clientName.trim() || !selectionLimit) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/photo-selection/projects", {
        projectName,
        clientName,
        clientEmail,
        clientPhone,
        enableLimitAlert,
        selectionLimit: parseInt(selectionLimit),
      });

      if (res.data?.success) {
        toast.success("Photo Selection Project created successfully!");
        setShowCreateModal(false);
        setProjectName("");
        setClientName("");
        setClientEmail("");
        setClientPhone("");
        setEnableLimitAlert(true);
        setSelectionLimit(100);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project? This will permanently delete all uploaded photos from the server and database.")) {
      return;
    }

    try {
      const res = await api.delete(`/photo-selection/projects/${projectId}`);
      if (res.data?.success) {
        toast.success("Project and all associated photos deleted successfully!");
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete project.");
    }
  };

  const handleCopyLink = (e, token) => {
    e.stopPropagation();
    const link = `${window.location.origin}/select/${token}`;
    navigator.clipboard.writeText(link);
    toast.success("Client link copied to clipboard!");
  };

  // Folder Operations
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      toast.error("Folder name cannot be empty.");
      return;
    }

    try {
      const res = await api.post(`/photo-selection/projects/${selectedProject._id}/folders`, {
        folderName: newFolderName.trim(),
      });
      if (res.data?.success) {
        toast.success("Folder created successfully!");
        setNewFolderName("");
        setShowCreateFolder(false);
        fetchFolders(selectedProject._id);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create folder.");
    }
  };

  const handleRenameFolder = async (folderId) => {
    if (!editingFolderName.trim()) {
      toast.error("Folder name cannot be empty.");
      return;
    }

    try {
      const res = await api.put(`/photo-selection/folders/${folderId}`, {
        folderName: editingFolderName.trim(),
      });
      if (res.data?.success) {
        toast.success("Folder renamed successfully!");
        setEditingFolderId(null);
        setEditingFolderName("");
        fetchFolders(selectedProject._id);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to rename folder.");
    }
  };

  const handleDeleteFolder = async (folderId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this folder?")) {
      return;
    }

    try {
      const res = await api.delete(`/photo-selection/folders/${folderId}`);
      if (res.data?.success) {
        toast.success("Folder deleted successfully!");
        fetchFolders(selectedProject._id);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete folder.");
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex h-60 flex-col items-center justify-center text-black">
        <Loader2 className="h-8 w-8 animate-spin text-black/30 mb-2" />
        <p className="text-xs text-black/45 uppercase tracking-wider font-semibold">Loading Projects...</p>
      </div>
    );
  }

  // PROJECT WORKSPACE VIEW
  if (selectedProject) {
    const isCompleted = selectedProject.status === "completed";

    return (
      <div className="space-y-6">
        {/* Workspace Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToProjects}
              className="p-2 hover:bg-black/5 rounded-full border border-black/10 transition cursor-pointer"
              title="Back to Projects"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-black">{selectedProject.projectName}</h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${isCompleted
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-amber-50 border-amber-200 text-amber-700"
                    }`}
                >
                  {isCompleted ? "Completed" : "Active"}
                </span>
              </div>
              <p className="text-xs text-black/55 mt-1 font-semibold tracking-wider">
                Client: {selectedProject.clientName}
                {selectedProject.clientEmail && ` | ${selectedProject.clientEmail}`}
                {selectedProject.clientPhone && ` | ${selectedProject.clientPhone}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={(e) => handleCopyLink(e, selectedProject.selectionToken)}
              className="inline-flex items-center gap-1.5 border border-black/15 hover:bg-black/2 bg-white text-black text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded transition cursor-pointer"
            >
              <Copy className="h-4 w-4" /> Copy Selection Link
            </button>

            <button
              onClick={() => setShowCreateAlbum(true)}
              className="inline-flex items-center gap-1.5 bg-black hover:bg-black/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded transition cursor-pointer shadow-sm"
            >
              <BookOpen className="h-4 w-4" /> Create Digital Album
            </button>

            {isCompleted && (
              <button
                onClick={() => {
                  setActiveCopyProjectId(selectedProject._id);
                  setActiveCopyFolderName("");
                }}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition cursor-pointer shadow-md shadow-emerald-600/10"
              >
                <FolderSync className="h-4 w-4" /> Create Selected Photos Folder
              </button>
            )}
          </div>
        </div>

        {/* Client submission summary statistics */}
        {isCompleted && selectionSummary && (
          <div className="rounded border border-emerald-500/20 bg-emerald-50/20 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Selection Completed Summary</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 text-xs">
              {selectionSummary.map((item) => (
                <div key={item.folderId} className="bg-white border border-emerald-100/50 rounded p-3 shadow-xs">
                  <p className="text-black/45 uppercase tracking-wider font-semibold truncate">{item.folderName}</p>
                  <p className="text-lg font-bold text-black mt-1">{item.selectedCount} Selected</p>
                </div>
              ))}
              <div className="bg-emerald-600 rounded p-3 text-white shadow-xs">
                <p className="uppercase tracking-wider font-semibold opacity-75">Total Selected</p>
                <p className="text-lg font-bold mt-1">
                  {selectedProject.selectedCount} / {selectedProject.selectionLimit}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Folder Management & Upload Section */}
        {activeUploadFolder ? (
          <div className="border border-black/10 rounded-3xl p-5 bg-neutral-50 shadow-inner space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">📁</span>
                <h4 className="font-bold text-black text-lg">
                  Uploading Previews to: <span className="underline">{activeUploadFolder.folderName}</span>
                </h4>
              </div>
              <button
                onClick={() => {
                  setActiveUploadFolder(null);
                  fetchFolders(selectedProject._id);
                }}
                className="text-xs text-[#74313d] font-bold hover:underline cursor-pointer border border-black/10 px-3 py-1.5 rounded-full bg-white hover:bg-neutral-100"
              >
                Go Back to Folders
              </button>
            </div>
            <PhotoUploader
              projectId={selectedProject._id}
              folderId={activeUploadFolder._id}
              onUploadComplete={() => {
                setActiveUploadFolder(null);
                fetchFolders(selectedProject._id);
              }}
            />
          </div>
        ) : showBulkUploader ? (
          <div className="border border-black/10 rounded-3xl p-5 bg-neutral-50 shadow-inner space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">📁</span>
                <h4 className="font-bold text-black text-lg">
                  Bulk Upload Folder to Project
                </h4>
              </div>
              <button
                onClick={() => {
                  setShowBulkUploader(false);
                  fetchFolders(selectedProject._id);
                }}
                className="text-xs text-[#74313d] font-bold hover:underline cursor-pointer border border-black/10 px-3 py-1.5 rounded-full bg-white hover:bg-neutral-100"
              >
                Go Back to Folders
              </button>
            </div>
            <PhotoUploader
              projectId={selectedProject._id}
              folderId={null}
              onUploadComplete={() => {
                setShowBulkUploader(false);
                fetchFolders(selectedProject._id);
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Event Folders</h2>

              {!isCompleted && (
                <div className="flex items-center gap-2">
                  {showCreateFolder ? (
                    <form onSubmit={handleCreateFolder} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Engagement"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="rounded border border-black/10 bg-white px-3 py-1.5 text-xs text-black placeholder-black/30 outline-none transition focus:border-black"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="bg-black hover:bg-black/90 text-white font-semibold text-xs px-3 py-1.5 rounded cursor-pointer"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateFolder(false);
                          setNewFolderName("");
                        }}
                        className="p-1 hover:bg-black/5 rounded-full border border-black/10 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowCreateFolder(true)}
                        className="rounded border border-black/15 hover:bg-black/5 text-black font-semibold text-xs px-4 py-2 transition flex items-center gap-1.5 cursor-pointer bg-white"
                      >
                        <Plus className="h-4 w-4" />  New Folder
                      </button>
                      <button
                        onClick={() => setShowBulkUploader(true)}
                        className="rounded border border-black/15 bg-black hover:bg-black/90 text-white font-semibold text-xs px-4 py-2 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Upload className="h-4 w-4" />  Upload Folders
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {loadingFolders ? (
              <div className="flex h-40 flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-black/25 mb-2" />
                <p className="text-xs text-black/45 uppercase tracking-wider font-semibold">Loading folders...</p>
              </div>
            ) : folders.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-black/10 rounded-2xl bg-white">
                <FolderOpen className="h-8 w-8 text-black/30 mx-auto mb-2" />
                <p className="text-sm font-semibold text-black">No folders found</p>
                <p className="text-xs text-black/45 mt-1">Add a new event folder to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {folders.map((folder) => {
                  const isEditing = editingFolderId === folder._id;

                  // Find selected counts for this folder if completed
                  const folderSummary = selectionSummary?.find(s => s.folderId === folder._id);

                  return (
                    <div
                      key={folder._id}
                      className="group rounded border border-black/8 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 overflow-hidden w-full">
                            <span className="text-2xl shrink-0">📁</span>
                            {isEditing ? (
                              <div className="flex items-center gap-1.5 w-full">
                                <input
                                  type="text"
                                  value={editingFolderName}
                                  onChange={(e) => setEditingFolderName(e.target.value)}
                                  className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-xs text-black outline-none focus:border-black font-semibold"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleRenameFolder(folder._id)}
                                  className="bg-black hover:bg-black/90 text-white font-semibold text-[10px] px-2 py-1 rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingFolderId(null);
                                    setEditingFolderName("");
                                  }}
                                  className="text-[10px] border border-black/10 rounded px-2 py-1"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <h3 className="font-bold text-black truncate leading-snug">{folder.folderName}</h3>
                            )}
                          </div>

                          {!isCompleted && !isEditing && (
                            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingFolderId(folder._id);
                                  setEditingFolderName(folder.folderName);
                                }}
                                className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-black cursor-pointer border border-transparent hover:border-black/5"
                                title="Rename Folder"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteFolder(folder._id, e)}
                                disabled={folder.totalPhotos > 0}
                                className={`p-1 rounded cursor-pointer border border-transparent ${folder.totalPhotos > 0
                                  ? "text-neutral-200 cursor-not-allowed"
                                  : "hover:bg-red-50 text-red-400 hover:text-red-600 hover:border-red-200"
                                  }`}
                                title={folder.totalPhotos > 0 ? "Cannot delete folder containing photos" : "Delete Folder"}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-neutral-50 border border-neutral-100 px-3 py-1 font-semibold text-neutral-600">
                            {folder.totalPhotos || 0} Photos
                          </span>

                          {isCompleted && folderSummary && (
                            <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                              {folderSummary.selectedCount} Selected
                            </span>
                          )}
                        </div>
                      </div>

                      {!isCompleted && (
                        <button
                          onClick={() => setActiveUploadFolder(folder)}
                          className="mt-5 w-full flex items-center justify-center gap-1.5 bg-black hover:bg-black/90 text-white font-semibold text-xs py-2 rounded transition cursor-pointer shadow-xs"
                        >
                          <Upload className="h-3.5 w-3.5" /> Upload Photos
                        </button>
                      )}

                      {isCompleted && (
                        <button
                          onClick={() => {
                            setActiveCopyProjectId(selectedProject._id);
                            setActiveCopyFolderName(folder.folderName);
                          }}
                          className="mt-5 w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 rounded-xl transition cursor-pointer shadow-xs"
                        >
                          <FolderSync className="h-3.5 w-3.5" /> Create Seperate Folder
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Digital Albums List Section */}
        {projectAlbums.length > 0 && (
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-base text-black">Generated Digital Albums ({projectAlbums.length})</h3>
              </div>
              <button
                onClick={() => setShowCreateAlbum(true)}
                className="text-xs font-bold text-black border border-black/15 px-3 py-1.5 rounded-xl hover:bg-black/5 transition cursor-pointer"
              >
                + New Album
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projectAlbums.map((album) => {
                const link = `${typeof window !== "undefined" ? window.location.origin : ""}/album/${album.albumToken}`;
                return (
                  <div key={album._id} className="rounded-2xl border border-black/10 bg-[#fbf9f5] p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-black truncate">{album.albumTitle}</h4>
                        <button
                          onClick={() => handleDeleteAlbum(album._id)}
                          className="text-neutral-400 hover:text-red-600 transition p-1 cursor-pointer"
                          title="Delete Album"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-black/50 mt-1 font-medium">{album.photos?.length || 0} Photos • Client: {album.clientName}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(link);
                          toast.success("Album link copied!");
                        }}
                        className="flex-1 rounded-xl border border-black/15 bg-white py-2 text-[11px] font-bold uppercase tracking-wider text-black hover:bg-black/5 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" /> Copy Link
                      </button>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-xl bg-black py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-black/90 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="h-3 w-3" /> View Album
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Local Folder Copy Modal overlay */}
        {activeCopyProjectId && (
          <LocalCopyModal
            projectId={activeCopyProjectId}
            filterFolderName={activeCopyFolderName}
            onClose={() => {
              setActiveCopyProjectId(null);
              setActiveCopyFolderName("");
              if (selectedProject) {
                fetchSelectionSummary(selectedProject._id);
              }
            }}
          />
        )}

        {/* Create Digital Album Modal overlay */}
        {showCreateAlbum && (
          <CreateAlbumModal
            project={selectedProject}
            onClose={() => setShowCreateAlbum(false)}
            onAlbumCreated={() => {
              if (selectedProject) fetchProjectAlbums(selectedProject._id);
            }}
          />
        )}
      </div>
    );
  }

  // MAIN PROJECTS LIST VIEW
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Studio Workflow</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black">Photo Selections</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">
            Create albums, upload preview photos, and copy client-selected high-res photos automatically.
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-full border border-black/10 bg-white p-1 shadow-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-full transition cursor-pointer ${
                viewMode === "grid" ? "bg-black text-white" : "text-black/50 hover:text-black hover:bg-black/5"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-full transition cursor-pointer ${
                viewMode === "list" ? "bg-black text-white" : "text-black/50 hover:text-black hover:bg-black/5"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-full bg-black hover:bg-black/90 text-white font-semibold text-sm px-6 py-2.5 transition flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <Plus className="h-4.5 w-4.5" /> Create Selection
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-black/10 rounded-2xl bg-white">
          <Camera className="h-10 w-10 text-black/30 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-black">No Photo Selections Created</h3>
          <p className="text-xs text-black/55 mt-1">Create your first client album list to upload photos.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const isCompleted = project.status === "completed";
            return (
              <div
                key={project._id}
                onClick={() => handleSelectProject(project)}
                className={`group overflow-hidden rounded border bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 flex flex-col justify-between cursor-pointer ${isCompleted ? "border-emerald-500/30" : "border-black/10"
                  }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-black leading-snug group-hover:underline">{project.projectName}</h3>
                      <p className="text-xs text-black/45 mt-1 font-semibold uppercase tracking-wider">
                        Client: {project.clientName}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${isCompleted
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-amber-50 border-amber-200 text-amber-700"
                          }`}
                      >
                        {isCompleted ? "Completed" : "Active"}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteProject(project._id, e)}
                        className="p-1.5 text-black/40 hover:text-red-600 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-black/5 bg-black/2 p-3 text-center">
                    <div>
                      <p className="text-xs text-black/45 uppercase tracking-wider">Uploaded</p>
                      <p className="text-lg font-bold text-black mt-0.5">{project.totalPhotos || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/45 uppercase tracking-wider">Selected</p>
                      <p className="text-lg font-bold text-black mt-0.5">
                        {project.selectedCount || 0} / {project.selectionLimit}
                      </p>
                    </div>
                  </div>

                  {/* Client shareable URL */}
                  <div className="mt-4 p-2 rounded-xl border border-black/5 bg-black/2 flex items-center justify-between text-xs">
                    <span className="text-black/45 font-semibold tracking-wider font-mono truncate max-w-[200px]">
                      /select/{project.selectionToken}
                    </span>
                    <button
                      onClick={(e) => handleCopyLink(e, project.selectionToken)}
                      className="text-black/65 hover:text-black font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectProject(project);
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-black/15 bg-white hover:bg-black/2 text-black font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Manage Workspace
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const isCompleted = project.status === "completed";
            return (
              <div
                key={project._id}
                onClick={() => handleSelectProject(project)}
                className={`group rounded border bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition hover:-translate-y-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                  isCompleted ? "border-emerald-500/30" : "border-black/10"
                }`}
              >
                <div className="flex items-center gap-4 min-w-[240px] max-w-sm overflow-hidden">
                  <span className="text-3xl shrink-0">📷</span>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-black group-hover:underline truncate">{project.projectName}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                          isCompleted
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-amber-50 border-amber-200 text-amber-700"
                        }`}
                      >
                        {isCompleted ? "Completed" : "Active"}
                      </span>
                    </div>
                    <p className="text-xs text-black/50 font-medium mt-0.5 truncate">
                      Client: {project.clientName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs shrink-0">
                  <div className="text-center sm:text-left">
                    <span className="text-black/45 block text-[10px] uppercase tracking-wider font-semibold">Uploaded</span>
                    <span className="text-sm font-bold text-black mt-0.5 block">{project.totalPhotos || 0}</span>
                  </div>

                  <div className="text-center sm:text-left">
                    <span className="text-black/45 block text-[10px] uppercase tracking-wider font-semibold">Selected</span>
                    <span className="text-sm font-bold text-black mt-0.5 block">{project.selectedCount || 0} / {project.selectionLimit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                  {/* Copy Link */}
                  <button
                    onClick={(e) => handleCopyLink(e, project.selectionToken)}
                    className="inline-flex items-center gap-1.5 border border-black/15 hover:bg-black/5 bg-white text-black text-xs font-semibold px-4 py-2 rounded transition cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy Link
                  </button>

                  {/* Manage Workspace */}
                  <button
                    onClick={() => handleSelectProject(project)}
                    className="inline-flex items-center gap-1.5 bg-black hover:bg-black/90 text-white text-xs font-semibold px-4 py-2 rounded transition cursor-pointer"
                  >
                    Manage Workspace
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteProject(project._id, e)}
                    className="p-2 text-black/40 hover:text-red-600 rounded hover:bg-red-50 border border-black/10 hover:border-red-200 transition cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal Dialog */}
      {showCreateModal && (
        <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
          <form
            onSubmit={handleCreateProject}
            className="relative w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="text-center mb-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-black mb-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-black">Create Selection Project</h3>
              <p className="text-xs text-black/50 leading-5 mt-1">Configure project limits and client parameters</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="pname" className="text-xs font-semibold uppercase tracking-wider text-black/60">Project Name</label>
              <input
                id="pname"
                type="text"
                placeholder="e.g. Rahul & Priya Wedding"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder-black/30 outline-none transition focus:border-black"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="cname" className="text-xs font-semibold uppercase tracking-wider text-black/60">Client Name</label>
                <input
                  id="cname"
                  type="text"
                  placeholder="e.g. Rahul"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder-black/30 outline-none transition focus:border-black"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="limit" className="text-xs font-semibold uppercase tracking-wider text-black/60">Selection Limit</label>
                <input
                  id="limit"
                  type="number"
                  placeholder="100"
                  value={selectionLimit}
                  onChange={(e) => setSelectionLimit(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder-black/30 outline-none transition focus:border-black"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="cemail" className="text-xs font-semibold uppercase tracking-wider text-black/60">Client Email (Optional)</label>
                <input
                  id="cemail"
                  type="email"
                  placeholder="rahul@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder-black/30 outline-none transition focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="cphone" className="text-xs font-semibold uppercase tracking-wider text-black/60">Client Mobile</label>
                <input
                  id="cphone"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder-black/30 outline-none transition focus:border-black"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1.5 pb-1">
              <input
                id="enableLimitAlert"
                type="checkbox"
                checked={enableLimitAlert}
                onChange={(e) => setEnableLimitAlert(e.target.checked)}
                className="h-4 w-4 rounded border border-black/15 bg-white text-black accent-black focus:ring-black cursor-pointer transition"
              />
              <label htmlFor="enableLimitAlert" className="text-xs font-bold uppercase tracking-wider text-black/60 cursor-pointer select-none">
                Alert client if selection exceeds limit
              </label>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="border border-black/10 hover:bg-black/2 font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-black hover:bg-black/90 disabled:bg-black/40 text-white font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer uppercase tracking-wider"
              >
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
