"use client";

import React from "react";

const rows = [
  {
    label: "Cost",
    left: "High",
    middle: "Moderate",
    right: "One-time"
  },

  {
    label: "Editing",
    left: "Limited",
    middle: "Hard",
    right: "Instant"
  },

  {
    label: "Guest Use",
    left: "Static",
    middle: "View-only",
    right: "Interactive"
  },

  {
    label: "Tracking",
    left: "None",
    middle: "Limited",
    right: "Live"
  },

  {
    label: "Navigation",
    left: "Manual",
    middle: "Shared Link",
    right: "One Tap"
  },

  {
    label: "Lifetime",
    left: "Single-use",
    middle: "Gets Lost",
    right: "Forever"
  },
];

export default function ComparisonTable() {
  return (
    <section className="bg-white text-black">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
        <h2 className="text-center text-2xl font-semibold">What Cards and Video Invites Can’t Do (But These Templates Can)</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-black/60">See how your invite can go from one-time share to a lasting experience — without extra cost or hassle.</p>

        {/* Responsive, non-scroll table: compact spacing on mobile, full layout on md+ */}
        <div className="mt-6">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="text-left">
                <th className="w-28 md:w-40 px-1 md:px-3 py-1 md:py-3 font-medium text-[11px] md:text-sm">Feature</th>
                <th className="w-1/3 px-1 md:px-3 py-1 md:py-3 font-medium text-[11px] md:text-sm text-center md:text-left whitespace-nowrap">Printed</th>
                <th className="w-1/3 px-1 md:px-3 py-1 md:py-3 font-medium text-[11px] md:text-sm text-center md:text-left whitespace-nowrap">WhatsApp</th>
                <th className="w-1/3 px-1 md:px-3 py-1 md:py-3 font-medium text-[11px] md:text-sm text-center md:text-left whitespace-nowrap">EnviteYou</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-black/10">
                  <td className="px-1 md:px-3 py-1 md:py-3 align-top text-[11px] md:text-sm font-medium whitespace-nowrap truncate">{r.label}</td>
                  <td className="px-1 md:px-3 py-1 md:py-3 align-top text-[11px] md:text-sm text-black/70 text-center md:text-left whitespace-nowrap truncate">{r.left}</td>
                  <td className="px-1 md:px-3 py-1 md:py-3 align-top text-[11px] md:text-sm text-black/70 text-center md:text-left whitespace-nowrap truncate">{r.middle}</td>
                  <td className="px-1 md:px-3 py-1 md:py-3 align-top text-[11px] md:text-sm font-semibold text-center md:text-left whitespace-nowrap truncate">{r.right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
