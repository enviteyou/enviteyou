"use client";

import React from "react";

const rows = [
  { label: "Investment", left: "High", middle: "Moderate", right: "High Value" },
  { label: "Guest Navigation", left: "Static Text", middle: "View-Only", right: "Interactive Maps" },
  { label: "Engagement Tracking", left: "Impossible", middle: "Limited", right: "Live Analytics" },
  { label: "Longevity", left: "Single-Use", middle: "Temporary", right: "Lifetime Access" },
];

export default function ComparisonTable() {
  return (
    <section className="bg-white text-black">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
        <h2 className="text-center text-2xl font-semibold">What Cards and Video Invites Can’t Do (But These Templates Can)</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-black/60">See how your invite can go from one-time share to a lasting experience — without extra cost or hassle.</p>

        {/* Desktop table */}
        <div className="mt-8 hidden md:block">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="text-left">
                <th className="w-1/4 px-4 py-4 font-medium text-sm">Feature</th>
                <th className="w-1/4 px-4 py-4 font-medium text-sm">Printed Cards</th>
                <th className="w-1/4 px-4 py-4 font-medium text-sm">WhatsApp Videos</th>
                <th className="w-1/4 px-4 py-4 font-medium text-sm">EnviteYou</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-black/10">
                  <td className="px-4 py-6 align-top text-sm font-medium">{r.label}</td>
                  <td className="px-4 py-6 align-top text-sm text-black/70">{r.left}</td>
                  <td className="px-4 py-6 align-top text-sm text-black/70">{r.middle}</td>
                  <td className="px-4 py-6 align-top text-sm font-semibold">{r.right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="mt-6 grid gap-4 md:hidden">
          {rows.map((r) => (
            <div key={r.label} className="rounded-lg border border-black/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{r.label}</div>
                <div className="text-sm font-semibold text-black">{r.right}</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-black/70">
                <div className="px-2 py-1 rounded bg-white/80">Printed: {r.left}</div>
                <div className="px-2 py-1 rounded bg-white/80">Video: {r.middle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
