"use client";

import { useState, useEffect } from "react";
import api from "@/api/axios";
import { toast } from "sonner";
import { Camera, Plus, Copy, Check, Upload, FolderSync, ExternalLink, Loader2, Sparkles, Trash2 } from "lucide-react";
import PhotoUploader from "../photo-selection/PhotoUploader";
import LocalCopyModal from "../photo-selection/LocalCopyModal";

export default function PhotoSelectionManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [selectionLimit, setSelectionLimit] = useState(100);
  const [submitting, setSubmitting] = useState(false);

  // Active project views
  const [activeUploadProjectId, setActiveUploadProjectId] = useState(null);
  const [activeCopyProjectId, setActiveCopyProjectId] = useState(null);

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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !clientName.trim() || !clientEmail.trim() || !selectionLimit) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/photo-selection/projects", {
        projectName,
        clientName,
        clientEmail,
        selectionLimit: parseInt(selectionLimit),
      });

      if (res.data?.success) {
        toast.success("Photo Selection Project created successfully!");
        setShowCreateModal(false);
        setProjectName("");
        setClientName("");
        setClientEmail("");
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

  const handleDeleteProject = async (projectId) => {
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

  const handleCopyLink = (token) => {
    const link = `${window.location.origin}/select/${token}`;
    navigator.clipboard.writeText(link);
    toast.success("Client link copied to clipboard!");
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex h-60 flex-col items-center justify-center text-black">
        <Loader2 className="h-8 w-8 animate-spin text-black/30 mb-2" />
        <p className="text-xs text-black/45 uppercase tracking-wider font-semibold">Loading Projects...</p>
      </div>
    );
  }

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
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-full bg-black hover:bg-black/90 text-white font-semibold text-sm px-6 py-2.5 transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="h-4.5 w-4.5" /> Create Selection
        </button>
      </div>

      {activeUploadProjectId && (
        <div className="border border-black/10 rounded-3xl p-5 bg-neutral-50 shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-black">Uploading Previews for Project</h4>
            <button
              onClick={() => {
                setActiveUploadProjectId(null);
                fetchProjects();
              }}
              className="text-xs text-[#74313d] font-bold hover:underline"
            >
              Close Uploader
            </button>
          </div>
          <PhotoUploader
            projectId={activeUploadProjectId}
            onUploadComplete={() => {
              setActiveUploadProjectId(null);
              fetchProjects();
            }}
          />
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-black/10 rounded-2xl bg-white">
          <Camera className="h-10 w-10 text-black/30 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-black">No Photo Selections Created</h3>
          <p className="text-xs text-black/55 mt-1">Create your first client album list to upload photos.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const isCompleted = project.status === "completed";
            return (
              <div
                key={project._id}
                className={`group overflow-hidden rounded-[1.35rem] border bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 flex flex-col justify-between ${isCompleted ? "border-emerald-500/30" : "border-black/10"
                  }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-black leading-snug">{project.projectName}</h3>
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
                        onClick={() => handleDeleteProject(project._id)}
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
                      onClick={() => handleCopyLink(project.selectionToken)}
                      className="text-black/65 hover:text-black font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  {!isCompleted ? (
                    <button
                      onClick={() => setActiveUploadProjectId(project._id)}
                      className="w-full flex items-center justify-center gap-2 border border-black/15 bg-white hover:bg-black/2 text-black font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer"
                    >
                      <Upload className="h-4 w-4" /> Upload Previews
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveCopyProjectId(project._id)}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer shadow-sm shadow-emerald-600/10"
                    >
                      <FolderSync className="h-4 w-4" /> Create Selected Photos Folder
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Local Folder Copy Modal overlay */}
      {activeCopyProjectId && (
        <LocalCopyModal
          projectId={activeCopyProjectId}
          onClose={() => setActiveCopyProjectId(null)}
        />
      )}

      {/* Create Project Modal Dialog */}
      {showCreateModal && (
        <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
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

            <div className="space-y-1">
              <label htmlFor="cemail" className="text-xs font-semibold uppercase tracking-wider text-black/60">Client Email</label>
              <input
                id="cemail"
                type="email"
                placeholder="e.g. rahul@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder-black/30 outline-none transition focus:border-black"
                required
              />
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
