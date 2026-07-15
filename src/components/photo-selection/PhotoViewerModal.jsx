"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import Image from "next/image";

export default function PhotoViewerModal({
  photos = [],
  currentIndex = 0,
  selectedPhotoIds = [],
  onClose,
  onNavigate,
  onSelectToggle,
}) {
  const currentPhoto = photos[currentIndex];
  const isSelected = currentPhoto ? selectedPhotoIds.includes(currentPhoto._id) : false;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === " " && currentPhoto) {
        e.preventDefault();
        onSelectToggle(currentPhoto);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, photos, currentPhoto, selectedPhotoIds]);

  if (!currentPhoto) return null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-5000 bg-black/95 flex flex-col select-none">
      {/* Top Header Controls */}
      <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10 bg-linear-to-b from-black/70 to-transparent">
        <span className="text-white text-xs font-semibold uppercase tracking-widest font-mono">
          {currentIndex + 1} / {photos.length} — {currentPhoto.originalFileName}
        </span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectToggle(currentPhoto)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
              isSelected ? "bg-emerald-500 text-white" : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <Check className="h-4 w-4" />
            {isSelected ? "Selected" : "Select"}
          </button>
          <button onClick={onClose} className="text-white/70 hover:text-white transition cursor-pointer">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Image Slider View */}
      <div className="flex-1 flex items-center justify-center relative px-4 sm:px-16">
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <div className="relative w-full max-w-[85vw] max-h-[80vh] aspect-auto flex justify-center items-center">
          <img
            src={currentPhoto.previewUrl}
            alt={currentPhoto.originalFileName}
            className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl animate-fade-in"
          />
        </div>

        {currentIndex < photos.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Footer shortcut hints */}
      <div className="p-4 text-center text-[10px] text-white/30 tracking-widest uppercase bg-linear-to-t from-black/70 to-transparent">
        Use Left/Right arrow keys to navigate • Spacebar to select/deselect
      </div>
    </div>
  );
}
