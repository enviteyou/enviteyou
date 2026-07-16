"use client";

import { useState } from "react";
import api from "@/api/axios";
import { FolderOpen, X, AlertTriangle, Check, Loader2, Download, Copy } from "lucide-react";
import { toast as toastSonner } from "sonner";

const rawExtensions = [".cr3", ".cr2", ".nef", ".arw", ".dng", ".raf"];

export default function LocalCopyModal({ projectId, onClose }) {
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

  const copyFiles = async () => {
    if (!browserSupported) {
      toastSonner.error("Your browser does not support the File System Access API. Please use Chrome, Edge, or another Chromium browser.");
      return;
    }

    try {
      // 1. Fetch exact client-selected photos from DB
      setCopyState("indexing");
      const dbRes = await api.get(`/photo-selection/projects/${projectId}/selection-details`);
      if (!dbRes.data?.success) {
        throw new Error("Failed to load project selection details from server");
      }
      const selectedPhotos = dbRes.data.selectedPhotos;
      const project = dbRes.data.project;
      if (selectedPhotos.length === 0) {
        toastSonner.error("No photos have been selected/submitted for this project yet.");
        setCopyState("idle");
        return;
      }

      setStats((prev) => ({ ...prev, totalSelected: selectedPhotos.length }));

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
        const safeName = (project.projectName || "Selected Album").replace(/[\\/:*?"<>|]/g, "_");
        targetFolderName = `${safeName}${formattedDate}`;
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

      for (const photo of selectedPhotos) {
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
          const destinationHandle = await targetDirHandle.getFileHandle(originalFile.name, {
            create: true,
          });

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
          <h2 className="text-xl font-bold text-black">Create Selected Photos Folder</h2>
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
            <div className="rounded-2xl border border-black/8 bg-black/2 p-4 text-xs text-black/60 leading-5">
              <span className="font-semibold text-black block mb-1">Process Overview:</span>
              1. EnviteYou fetches client-selected photo names from the database.<br />
              2. You select the local folder holding original high-quality photos.<br />
              3. The browser matches base names (case-insensitive, ignoring extensions).<br />
              4. A subfolder named <span className="font-mono text-black font-semibold">Selected Album Photos</span> is created.<br />
              5. Matching local high-res photos are copied directly inside that subfolder.
            </div>

            <button
              onClick={copyFiles}
              className="w-full bg-black hover:bg-black/90 text-white font-semibold text-sm py-3 rounded-xl transition cursor-pointer"
            >
              Select Folder &amp; Start Copying
            </button>
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
