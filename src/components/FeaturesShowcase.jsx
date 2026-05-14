"use client";

import React from "react";

const features = [
  {
    label: "Cost",
    title: "Cheaper than most WhatsApp and printed invites",
    icon: "💰",
  },
  {
    label: "Elder-Friendly Design",
    title: "No more squinting at tiny-boring WhatsApp videos",
    icon: "🔍",
  },
  {
    label: "Pre-Wedding Highlight",
    title: "Showcase your shoot like never before",
    icon: "📸",
  },
  {
    label: "Instant Edits",
    title: "Any change? Update anything instantly even after sharing",
    icon: "⚙️",
  },
  {
    label: "Ritual-Ready Templates",
    title: "Includes deities and editable mantras for Hindu weddings",
    icon: "🙏",
  },
  {
    label: "Private Guest Pages",
    title: "Invite different guests to different events securely",
    icon: "🔒",
  },
  {
    label: "Mobile-First Experience",
    title: "Perfect on any device, looks stunning on mobile screens",
    icon: "📱",
  },
];

export default function FeaturesShowcase() {
  return (
    <section className="relative bg-white text-black">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          {/* Left Column - Scrolls Normally */}
          <div className="lg:sticky lg:top-16 lg:h-fit">
            <div className="space-y-6">
              {/* Badge */}
              <div>
                <span className="inline-flex rounded-full border border-black/20 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-black/70">
                  Features
                </span>
              </div>

              {/* Heading */}
              <div>
                <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-5xl">
                  The Wedding Invite,
                  <br />
                  Reinvented.
                </h2>
              </div>

              {/* Description */}
              <p className="max-w-sm text-base leading-7 text-black/62">
                Mobile-first, effortless to share. Costs less than printed cards, but feels far more premium.
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <button className="rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-black/90">
                  Choose a template
                </button>
              </div>
            </div>
          </div>

          {/* Right Features Column */}
          <div className="space-y-0">
            {features.map((feature, index) => (
              <React.Fragment key={feature.label}>
                <div 
                  className="sticky top-16 group overflow-hidden transition-all duration-300 hover:bg-black/2 py-10 px-0 bg-white"
                  style={{ zIndex: index }}
                >
                  <div className="flex gap-8 sm:gap-10">
                    {/* Icon */}
                    <div className="flex shrink-0 items-start justify-center pt-1">
                      <div className="text-4xl sm:text-4xl transition duration-300 group-hover:scale-110">
                        {feature.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-start">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/50 mb-2">
                        {feature.label}
                      </p>
                      <h3 className="text-xl font-medium leading-snug sm:text-2xl text-black/90">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                {index < features.length - 1 && (
                  <div className="h-px bg-black/30" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
