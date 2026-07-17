"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FCFAF8] px-6 text-black select-none">
      {/* Dynamic Background Elements for premium atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#74313d]/5 to-transparent blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#d4af37]/5 to-transparent blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center max-w-md text-center z-10">
        {/* Elegant Floating Concentric Loader Container */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-10">
          {/* Outer Pulsing Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#74313d]/10 via-[#d4af37]/10 to-transparent blur-md animate-pulse duration-[3000ms]" />

          {/* Third Outer Fine Ring */}
          <div className="absolute w-20 h-20 rounded-full border border-dashed border-[#74313d]/10 animate-[spin_40s_linear_infinite]" />

          {/* Second Middle Spinning Ring */}
          <div className="absolute w-16 h-16 rounded-full border border-y-[#d4af37]/40 border-x-transparent animate-[spin_4s_linear_infinite]" />

          {/* First Inner Counter-Spinning Ring */}
          <div className="absolute w-12 h-12 rounded-full border border-x-[#74313d]/60 border-y-transparent animate-[spin_2.5s_linear_infinite_reverse]" />

          {/* Central Elegant Monogram / Heart Motif */}
          <div className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-black/5 animate-pulse">
            <span className="text-[10px] font-bold tracking-widest text-[#74313d] pl-0.5">E</span>
          </div>
        </div>

        {/* Elegant typography & tracking */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#74313d] opacity-80 animate-pulse duration-[2000ms]">
            ENVITEYOU
          </h2>

          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight font-serif text-[#1e1b18] opacity-90">
            Designing your digital story
          </h2>

          {/* Fading elegant status updates */}
          <p className="text-xs text-black/45 tracking-wide max-w-[280px] mx-auto animate-pulse duration-[1500ms]">
            Preparing premium layouts, theme animations, and interactive invitation details...
          </p>
        </div>
      </div>

      {/* Footer Branding Note */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-medium uppercase tracking-[0.25em] text-black/30">
        © EnviteYou Studio
      </div>
    </div>
  );
}
