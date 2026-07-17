"use client";

import { useState, useEffect } from "react";
import api from "@/api/axios";
import { FolderOpen, X, AlertTriangle, Check, Loader2, Download, Copy } from "lucide-react";
import { toast as toastSonner } from "sonner";

const rawExtensions = [".cr3", ".cr2", ".nef", ".arw", ".dng", ".raf"];

export default function LocalCopyModal({ projectId, filterFolderName = "", onClose }) {
  const [browserSupported] = useState(() => typeof window !== "undefined" && "showDirectoryPicker" in window);
  const [copyState, setCopyState] = useState("idle"); // "idle" | "indexing" | "copying" | "done"
  const [stats, setStats] = useState({
    totalSelected: 0,
    copied: 0,
    missing: 0,
    failed: 0,
    currentFile: "",
  });
  const [missingList, setMissingList] = useState([]);
  const [duplicateList, setDuplicateList] = useState([]);

  // States for dynamic folders select
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [project, setProject] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [selectedFoldersToCopy, setSelectedFoldersToCopy] = useState({});
  const [uniqueFoldersList, setUniqueFoldersList] = useState([]);

  useEffect(() => {
    async function loadSelectionDetails() {
      try {
        setLoadingDetails(true);
        const dbRes = await api.get(`/photo-selection/projects/${projectId}/selection-details`);
        if (dbRes.data?.success) {
          const photos = dbRes.data.selectedPhotos || [];
          setSelectedPhotos(photos);
          setProject(dbRes.data.project);

          const folderNames = Array.from(new Set(photos.map(p => p.folderName || "Unassigned")));
          setUniqueFoldersList(folderNames);

          const initialChecked = {};
          if (filterFolderName) {
            const matchedName = folderNames.find(name => name.toLowerCase() === filterFolderName.toLowerCase()) || filterFolderName;
            initialChecked[matchedName] = true;
          } else {
            folderNames.forEach(name => {
              initialChecked[name] = true;
            });
          }
          setSelectedFoldersToCopy(initialChecked);
        }
      } catch (err) {
        console.error(err);
        toastSonner.error("Failed to load project details.");
      } finally {
        setLoadingDetails(false);
      }
    }
    loadSelectionDetails();
  }, [projectId]);

  const copyFiles = async () => {
    if (!browserSupported) {
      toastSonner.error("Your browser does not support the File System Access API. Please use Chrome, Edge, or another Chromium browser.");
      return;
    }

    try {
      const foldersToCopy = Object.keys(selectedFoldersToCopy).filter(k => selectedFoldersToCopy[k]);
      const targetPhotos = selectedPhotos.filter(photo => foldersToCopy.includes(photo.folderName || "Unassigned"));

      if (targetPhotos.length === 0) {
        toastSonner.error("No photos to copy. Please check at least one event folder.");
        return;
      }

      setCopyState("indexing");
      setStats((prev) => ({ ...prev, totalSelected: targetPhotos.length, copied: 0, missing: 0, failed: 0 }));

      // Generate unique target folder name based on project name and date
      let targetFolderName = "Selected Album Photos";
      if (project) {
        let formattedDate = "";
        try {
          const dateObj = new Date(project.createdAt);
          const day = String(dateObj.getDate()).padStart(2, "0");
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const year = dateObj.getFullYear();
          formattedDate = ` (${day}-${month}-${year})`;
        } catch (e) {
          // ignore date format error
        }
        const safeProjectName = (project.projectName || "Selected Album").replace(/[\\/:*?"<>|]/g, "_");
        if (filterFolderName) {
          const safeFolderName = filterFolderName.replace(/[\\/:*?"<>|]/g, "_");
          targetFolderName = `${safeProjectName}_${safeFolderName}${formattedDate}`;
        } else {
          targetFolderName = `${safeProjectName}_Selected_Album${formattedDate}`;
        }
      }

      // 2. Open directory picker
      const directoryHandle = await window.showDirectoryPicker({
        mode: "readwrite",
      });

      // 3. Scan & Index files case-insensitively by base name
      const filesMap = new Map(); // key: baseName.toLowerCase(), value: FileSystemFileHandle
      const duplicates = [];

      async function scanDir(dirHandle) {
        for await (const entry of dirHandle.values()) {
          if (entry.kind === "file") {
            const name = entry.name;
            const extIndex = name.lastIndexOf(".");
            const baseName = extIndex !== -1 ? name.substring(0, extIndex) : name;
            const key = baseName.toLowerCase();

            if (filesMap.has(key)) {
              const existing = filesMap.get(key);
              duplicates.push({
                baseName,
                existingName: existing.name,
                newName: entry.name,
              });

              // Prioritize RAW format if duplicate base name is found
              const ext = name.substring(extIndex).toLowerCase();
              const isNewRaw = rawExtensions.includes(ext);
              if (isNewRaw) {
                filesMap.set(key, entry);
              }
            } else {
              filesMap.set(key, entry);
            }
          } else if (entry.kind === "directory") {
            // Avoid scanning our created target folder to prevent infinite loop
            if (entry.name !== targetFolderName) {
              await scanDir(entry);
            }
          }
        }
      }

      await scanDir(directoryHandle);
      setDuplicateList(duplicates);

      // 4. Create target subdirectory with the unique folder name
      const targetDirHandle = await directoryHandle.getDirectoryHandle(targetFolderName, {
        create: true,
      });

      // 5. Copy photos sequentially
      setCopyState("copying");
      let copiedCount = 0;
      let missingCount = 0;
      let failedCount = 0;
      const missingArr = [];

      for (const photo of targetPhotos) {
        const key = photo.originalBaseName.toLowerCase();
        const sourceHandle = filesMap.get(key);

        if (!sourceHandle) {
          missingArr.push(photo.originalFileName || `${photo.originalBaseName}.*`);
          missingCount++;
          setStats((prev) => ({
            ...prev,
            missing: missingCount,
          }));
          continue;
        }

        setStats((prev) => ({
          ...prev,
          currentFile: sourceHandle.name,
        }));

        try {
          const originalFile = await sourceHandle.getFile();
          
          let destinationHandle;
          if (filterFolderName) {
            destinationHandle = await targetDirHandle.getFileHandle(originalFile.name, {
              create: true,
            });
          } else {
            const eventFolderName = photo.folderName || "Unassigned";
            const eventDirHandle = await targetDirHandle.getDirectoryHandle(eventFolderName, {
              create: true,
            });
            destinationHandle = await eventDirHandle.getFileHandle(originalFile.name, {
              create: true,
            });
          }

          const writable = await destinationHandle.createWritable();
          await writable.write(originalFile);
          await writable.close();

          copiedCount++;
          setStats((prev) => ({
            ...prev,
            copied: copiedCount,
          }));
        } catch (err) {
          console.error("Failed to copy file", sourceHandle.name, err);
          failedCount++;
          setStats((prev) => ({
            ...prev,
            failed: failedCount,
          }));
        }
      }

      setMissingList(missingArr);
      setCopyState("done");
      toastSonner.success("Photo copy process finished!");
    } catch (err) {
      if (err.name === "AbortError") {
        toastSonner.warning("Folder selection was cancelled.");
      } else {
        console.error(err);
        toastSonner.error(err.message || "An error occurred during local folder copy.");
      }
      setCopyState("idle");
    }
  };

  const handleCopyMissing = () => {
    if (missingList.length === 0) return;
    const text = missingList.join("\n");
    navigator.clipboard.writeText(text);
    toastSonner.success("Missing photos list copied to clipboard!");
  };

  const handleDownloadMissing = () => {
    if (missingList.length === 0) return;
    const text = missingList.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `missing-photos-project-${projectId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const progressPercent =
    stats.totalSelected > 0
      ? Math.round(((stats.copied + stats.missing + stats.failed) / stats.totalSelected) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-black/10 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          disabled={copyState === "indexing" || copyState === "copying"}
          className="absolute top-4 right-4 text-black/45 hover:text-black transition cursor-pointer disabled:opacity-30"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-black mb-4">
            <FolderOpen className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-black">
            {filterFolderName ? `Create Selected Folder: ${filterFolderName}` : "Create Selected Photos Folder"}
          </h2>
          <p className="mt-2 text-xs text-black/50 leading-5">
            Your original photos stay on your device. EnviteYou only accesses the folder you explicitly select.
          </p>
        </div>

        {!browserSupported && (
          <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center">
            <AlertTriangle className="h-5 w-5 text-amber-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-amber-800">Unsupported Browser</h4>
            <p className="mt-1 text-xs text-amber-700/80 leading-5">
              The File System Access API is not supported in Safari or Firefox. Please reopen this dashboard in Google Chrome, Microsoft Edge, or a Chromium-based browser.
            </p>
          </div>
        )}

        {browserSupported && copyState === "idle" && (
          <div className="mt-6 space-y-4">
            {loadingDetails ? (
              <div className="flex h-24 flex-col items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-black/35 mb-2" />
                <p className="text-[10px] text-black/45 uppercase tracking-wider font-semibold">Loading selection details...</p>
              </div>
            ) : selectedPhotos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 p-6 text-center text-xs text-black/55 leading-relaxed">
                No photos have been selected/submitted for this project yet. Please check again after the client submits.
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-black/8 bg-black/2 p-4 text-xs text-black/60 leading-5">
                  <span className="font-semibold text-black block mb-1">Process Overview:</span>
                  {filterFolderName ? (
                    <>
                      1. You select the local folder holding original high-quality photos.<br />
                      2. The browser matches base names (case-insensitive, ignoring extensions).<br />
                      3. A subfolder named <span className="font-mono text-black font-semibold">{project?.projectName?.replace(/[\\/:*?"<>|]/g, "_")}_{filterFolderName.replace(/[\\/:*?"<>|]/g, "_")}</span> is created.<br />
                      4. Matching high-res originals for the <span className="font-semibold">{filterFolderName}</span> event are copied directly inside that subfolder.
                    </>
                  ) : (
                    <>
                      1. You select the local folder holding original high-quality photos.<br />
                      2. The browser matches base names (case-insensitive, ignoring extensions).<br />
                      3. Event subfolders are created inside <span className="font-mono text-black font-semibold">{project?.projectName?.replace(/[\\/:*?"<>|]/g, "_")}_Selected_Album</span>.<br />
                      4. Matching local high-res photos are copied into their respective event subfolders.
                    </>
                  )}
                </div>

                {uniqueFoldersList.length > 0 && !filterFolderName && (
                  <div className="space-y-2 border border-black/8 rounded-2xl p-4 bg-black/2 max-h-40 overflow-y-auto">
                    <p className="text-xs font-bold uppercase tracking-wider text-black/55 mb-2">Select Event Folders to Copy:</p>
                    {uniqueFoldersList.map(folderName => (
                      <label key={folderName} className="flex items-center gap-2 text-sm text-black font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!selectedFoldersToCopy[folderName]}
                          onChange={(e) => {
                            setSelectedFoldersToCopy(prev => ({
                              ...prev,
                              [folderName]: e.target.checked
                            }));
                          }}
                          className="rounded border-black/20 focus:ring-0 cursor-pointer"
                        />
                        <span>{folderName} ({selectedPhotos.filter(p => (p.folderName || "Unassigned") === folderName).length} photos)</span>
                      </label>
                    ))}
                  </div>
                )}

                <button
                  onClick={copyFiles}
                  className="w-full bg-black hover:bg-black/90 text-white font-semibold text-sm py-3 rounded-xl transition cursor-pointer"
                >
                  Select Folder &amp; Start Copying
                </button>
              </>
            )}
          </div>
        )}

        {(copyState === "indexing" || copyState === "copying") && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-black">
                {copyState === "indexing" ? "Scanning and Indexing Local Files..." : "Copying Original Photos..."}
              </span>
              <span className="text-black/60 font-medium">
                {stats.copied + stats.missing + stats.failed} / {stats.totalSelected}
              </span>
            </div>

            <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300 animate-pulse"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="text-xs text-black/60 font-medium space-y-1">
              <div className="flex justify-between">
                <span>{progressPercent}% Complete</span>
                {copyState === "indexing" ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Scanning...
                  </span>
                ) : (
                  <span>Copied: {stats.copied} • Missing: {stats.missing}</span>
                )}
              </div>
              {stats.currentFile && (
                <p className="text-black/45 truncate mt-1">
                  Current: <span className="font-mono font-semibold">{stats.currentFile}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {copyState === "done" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-black/8 bg-emerald-50/50 p-4 flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white mt-0.5">
                <Check className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-black">Process Completed Successfully</h4>
                <p className="mt-1 text-xs text-black/60 leading-5">
                  Copied: <span className="font-bold text-black">{stats.copied}</span> photos<br />
                  Missing: <span className="font-bold text-black">{stats.missing}</span> photos<br />
                  Failed: <span className="font-bold text-black">{stats.failed}</span> photos
                </p>
              </div>
            </div>

            {duplicateList.length > 0 && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" /> {duplicateList.length} Duplicate names resolved:
                </p>
                <p className="text-amber-700/80 leading-relaxed">
                  Multiple files with the same base name were detected. The copy process prioritized RAW extensions ({rawExtensions.join(", ")}) or the first found instance.
                </p>
              </div>
            )}

            {missingList.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-black/45">
                    Missing Photos ({missingList.length})
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyMissing}
                      className="inline-flex items-center gap-1 text-xs text-black/65 hover:text-black border border-black/10 rounded px-2 py-1 transition cursor-pointer"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                    <button
                      onClick={handleDownloadMissing}
                      className="inline-flex items-center gap-1 text-xs text-black/65 hover:text-black border border-black/10 rounded px-2 py-1 transition cursor-pointer"
                    >
                      <Download className="h-3 w-3" /> Download
                    </button>
                  </div>
                </div>
                <div className="max-h-24 overflow-y-auto border border-black/10 rounded-xl p-3 bg-black/2 font-mono text-[10px] text-black/60 space-y-1 hide-scrollbar">
                  {missingList.map((file, idx) => (
                    <div key={idx}>{file}</div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full border border-black/10 hover:bg-black/2 text-black font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
