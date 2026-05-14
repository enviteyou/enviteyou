"use client";

import React from "react";

const features = [
  {
    label: "Live Guest Analytics",
    title:
      "Access a private tracking dashboard. See your total views, visitor cities, and watch the excitement build in real-time as guests open your link.",
    icon: "📊",
  },
  {
    label: "The Forever Link",
    title:
      "Pay once. Keep it for a lifetime. Your digital wedding website stays online forever as a beautiful memory of your celebrations.",
    icon: "🔗",
  },
  {
    label: "Elder-Friendly Design",
    title:
      "No apps to download. No zooming required. One simple tap opens your invite perfectly on any mobile browser, making it easy for guests of all ages.",
    icon: "👴",
  },
  {
    label: "One-Tap Directions",
    title:
      "Ensure the Baraat arrives exactly on time. Integrated Google Maps allows your guests to get driving directions to your venue with a single click.",
    icon: "📍",
  },
  {
    label: "Save the Date, Instantly",
    title:
      'Never worry about guests forgetting the Muhurat. A seamless "Add to Calendar" button syncs your event timings directly to their phones.',
    icon: "📅",
  },
];

export default function FeaturesShowcase() {
  return (
    <section className="relative bg-white text-black">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          {/* Left Column - Scrolls Normally */}
          <div className="lg:sticky lg:top-16 lg:h-fit">
            <div className="space-y-1">
              {/* Badge */}
              <div>
                <span className="inline-flex mb-1 rounded-full border border-black/20 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-black/70">
                  Features
                </span>
              </div>

              {/* Heading */}
              <div>
                <h2 className="text-3xl font-medium leading-tight tracking-normal sm:text-3xl lg:text-3xl">
                  The Wedding Invite,
                  <br />
                  Perfected.
                </h2>
              </div>

              {/* Description */}
              <p className="max-w-sm text-base leading-tight text-black/62">
                Smarter than a printed card. More elegant than a WhatsApp video. Built to handle the beautiful chaos of your big day.
              </p>

              {/* CTA Button */}
              {/* <div className="pt-4">
                <button className="rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.12)] transition duration-300 ">
                  Choose a template
                </button>
              </div> */}
            </div>
          </div>

          {/* Right Features Column */}
          <div className="space-y-0">
            {features.map((feature, index) => (
              <React.Fragment key={feature.label}>
                <div 
                  className="sticky top-16  overflow-hidden transition-all duration-300  py-10 px-0 bg-white"
                  style={{ zIndex: index }}
                >
                  <div className="flex gap-8 sm:gap-10">
                    {/* Icon */}
                    <div className="flex shrink-0 items-start justify-center pt-1">
                      <div className="text-4xl sm:text-4xl transition duration-300 ">
                        {feature.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-start">
                      <p className="text-xs font-bold  tracking-[0.15em] text-black mb-2">
                        {feature.label}
                      </p>
                      <h3 className="text-sm font-light leading-tight tracking-tighter sm:text-2xl text-black">
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
