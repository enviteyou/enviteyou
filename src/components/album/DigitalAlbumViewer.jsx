"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  BookOpen,
  Grid,
  X,
  Volume2,
  VolumeX,
  Share2,
  Check
} from "lucide-react";
import { toast } from "sonner";

// Group photos into spreads (pages) with intelligent varied layouts
function generateAlbumSpreads(photos) {
  if (!photos || photos.length === 0) return [];

  const spreads = [];
  let index = 0;
  const total = photos.length;

  while (index < total) {
    const remaining = total - index;
    // Rotate through layouts: 1 photo, 2 photos, 3 photos, 4 photos
    let count = 1;
    if (remaining >= 4 && index % 4 === 0) {
      count = 4;
    } else if (remaining >= 3 && index % 3 === 0) {
      count = 3;
    } else if (remaining >= 2 && index % 2 === 0) {
      count = 2;
    } else {
      count = 1;
    }

    const chunk = photos.slice(index, index + count);
    spreads.push({
      id: `spread-${spreads.length + 1}`,
      layoutType: count,
      photos: chunk,
    });
    index += count;
  }

  return spreads;
}

export default function DigitalAlbumViewer({ album }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUntying, setIsUntying] = useState(false);
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const photos = album?.photos || [];
  const spreads = useMemo(() => generateAlbumSpreads(photos), [photos]);
  const currentSpread = spreads[currentSpreadIndex];

  const totalPages = spreads.length;

  const handleOpenAlbum = () => {
    if (isUntying || isOpen) return;
    setIsUntying(true);
    setTimeout(() => {
      setIsOpen(true);
      setIsUntying(false);
    }, 900);
  };

  const handleNext = useCallback(() => {
    if (currentSpreadIndex < totalPages - 1) {
      setDirection(1);
      setCurrentSpreadIndex((prev) => prev + 1);
    }
  }, [currentSpreadIndex, totalPages]);

  const handlePrev = useCallback(() => {
    if (currentSpreadIndex > 0) {
      setDirection(-1);
      setCurrentSpreadIndex((prev) => prev - 1);
    }
  }, [currentSpreadIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: album?.albumTitle || "Digital Photo Album",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Album link copied to clipboard!");
    }
  };

  if (!album) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0f0e13] font-sans text-white select-none">
      {/* Background Ambient Lighting Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-[#121118] to-[#0a090d] pointer-events-none" />

      {/* STAGE 1: CLOSED ALBUM COVER WITH UNTYING RIBBON */}
      {!isOpen && (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-xl aspect-3/4 rounded-2xl bg-gradient-to-br from-[#1e1915] via-[#2a221b] to-[#120e0b] p-8 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-amber-900/30 flex flex-col justify-between items-center text-center overflow-hidden cursor-pointer group"
            onClick={handleOpenAlbum}
          >
            {/* Book Spine Detail */}
            <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/80 to-transparent border-r border-amber-500/20" />

            {/* Leather texture overlay */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Header / Crest */}
            <div className="z-10 mt-6 space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/10 text-amber-300 shadow-inner">
                <BookOpen className="h-7 w-7" />
              </div>
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-amber-400/80">
                Exclusive Photo Album
              </p>
            </div>

            {/* Album Titles */}
            <div className="z-10 space-y-4 max-w-md">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-amber-100 drop-shadow-md">
                {album.albumTitle}
              </h1>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto" />
              <p className="text-sm font-medium tracking-widest uppercase text-amber-200/70">
                {album.clientName}
              </p>
            </div>

            {/* Bottom Details */}
            <div className="z-10 mb-4 text-xs font-semibold text-amber-300/50 tracking-wider">
              {photos.length} Precious Moments
            </div>

            {/* ANIMATED SATIN RIBBON OVERLAY */}
            <motion.div
              animate={isUntying ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 py-4 bg-gradient-to-r from-[#8b0000] via-[#a81c1c] to-[#600000] shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center justify-center border-y border-amber-300/40"
            >
              <div className="flex items-center gap-3 bg-amber-400/10 px-6 py-2 rounded-full border border-amber-300/30 backdrop-blur-xs animate-pulse">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200">
                  Tap Ribbon to Open
                </span>
                <Sparkles className="h-4 w-4 text-amber-300" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* STAGE 2: 3D DIGITAL FLIPBOOK VIEWER */}
      {isOpen && (
        <div className="relative flex min-h-screen flex-col justify-between p-4 sm:p-8">
          {/* Top Navbar */}
          <div className="z-30 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-amber-100 transition cursor-pointer"
              >
                <BookOpen className="h-4 w-4" /> Close Album
              </button>
              <span className="hidden sm:inline text-white/20">|</span>
              <span className="hidden sm:inline text-xs font-semibold text-white/70 truncate max-w-xs">
                {album.albumTitle}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowThumbnails(!showThumbnails)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition cursor-pointer"
                title="Toggle Thumbnails"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition cursor-pointer"
                title="Share Album"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition cursor-pointer"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* MAIN SPREAD CONTAINER WITH 3D PERSPECTIVE */}
          <div className="relative my-auto flex items-center justify-center py-6 perspective-1600">
            {/* Left Control Arrow */}
            <button
              onClick={handlePrev}
              disabled={currentSpreadIndex === 0}
              className="absolute left-2 sm:left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white transition hover:bg-amber-500 hover:text-black disabled:opacity-20 disabled:pointer-events-none cursor-pointer shadow-xl"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Right Control Arrow */}
            <button
              onClick={handleNext}
              disabled={currentSpreadIndex === totalPages - 1}
              className="absolute right-2 sm:right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white transition hover:bg-amber-500 hover:text-black disabled:opacity-20 disabled:pointer-events-none cursor-pointer shadow-xl"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* 3D Page Spread Card */}
            <div className="w-full max-w-5xl aspect-16/10 sm:aspect-16/9 rounded-2xl bg-[#1a1820] shadow-[0_25px_80px_rgba(0,0,0,0.9)] border border-white/10 overflow-hidden relative flex">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentSpreadIndex}
                  custom={direction}
                  initial={{ rotateY: direction > 0 ? 45 : -45, opacity: 0, scale: 0.95 }}
                  animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateY: direction > 0 ? -45 : 45, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full h-full p-4 sm:p-8 flex items-center justify-center transform-style-3d bg-gradient-to-r from-[#17151c] via-[#221f29] to-[#17151c]"
                >
                  {/* Spine Division Line */}
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-black/60 via-amber-500/10 to-black/60 border-x border-white/5 pointer-events-none z-20" />

                  {/* Dynamic Multi-Photo Layout Spreads */}
                  {currentSpread?.layoutType === 1 && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                        <Image
                          src={currentSpread.photos[0].url}
                          alt={currentSpread.photos[0].caption || "Album photo"}
                          fill
                          priority
                          className="object-contain transition-transform duration-500 group-hover:scale-102"
                        />
                      </div>
                    </div>
                  )}

                  {currentSpread?.layoutType === 2 && (
                    <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentSpread.photos.map((pt, i) => (
                        <div key={i} className="relative w-full h-full rounded-xl overflow-hidden shadow-xl border border-white/10">
                          <Image
                            src={pt.url}
                            alt={pt.caption || `Photo ${i}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {currentSpread?.layoutType === 3 && (
                    <div className="w-full h-full grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="relative sm:col-span-2 w-full h-full rounded-xl overflow-hidden shadow-xl border border-white/10">
                        <Image
                          src={currentSpread.photos[0].url}
                          alt="Main photo"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="grid grid-rows-2 gap-4 w-full h-full">
                        {currentSpread.photos.slice(1).map((pt, i) => (
                          <div key={i} className="relative w-full h-full rounded-xl overflow-hidden shadow-md border border-white/10">
                            <Image
                              src={pt.url}
                              alt={`Sub photo ${i}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentSpread?.layoutType === 4 && (
                    <div className="w-full h-full grid grid-cols-2 gap-4">
                      {currentSpread.photos.map((pt, i) => (
                        <div key={i} className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-white/10">
                          <Image
                            src={pt.url}
                            alt={`Grid photo ${i}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* BOTTOM CONTROLS & PAGE INDICATOR */}
          <div className="z-30 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl gap-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              {album.clientName} &bull; {photos.length} Photos
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                Page {currentSpreadIndex + 1} of {totalPages}
              </span>
              <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${((currentSpreadIndex + 1) / totalPages) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* THUMBNAILS DRAWER */}
          {showThumbnails && (
            <div className="fixed inset-x-4 bottom-20 z-50 rounded-2xl border border-white/15 bg-black/90 backdrop-blur-xl p-4 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Album Spreads Navigation
                </span>
                <button
                  onClick={() => setShowThumbnails(false)}
                  className="text-white/60 hover:text-white transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto py-2 scrollbar-none">
                {spreads.map((spread, sIdx) => (
                  <button
                    key={spread.id}
                    onClick={() => {
                      setDirection(sIdx > currentSpreadIndex ? 1 : -1);
                      setCurrentSpreadIndex(sIdx);
                      setShowThumbnails(false);
                    }}
                    className={`relative shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                      sIdx === currentSpreadIndex ? "border-amber-400 scale-105" : "border-white/20 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {spread.photos[0] && (
                      <Image
                        src={spread.photos[0].url}
                        alt={`Spread ${sIdx + 1}`}
                        fill
                        className="object-cover"
                      />
                    )}
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-bold px-1 rounded text-white">
                      {sIdx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
