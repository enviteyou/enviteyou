"use client";

import React from "react";
import Image from "next/image";

const features = [
  {
    label: "Live Guest Analytics",
    title:
      "Track views, visitor cities, devices and clicks from your private dashboard.",
    icon: "/feature_icon/14.png",
  },
  {
    label: "Forever Wedding Link",
    title:
      "Pay once and keep your wedding website online forever as a digital memory.",
    icon: "/feature_icon/13.png",
  },
  {
    label: "Elder-Friendly Design",
    title:
      "No app. No download. No zooming. Your invite opens clearly on any phone.",
    icon: "/feature_icon/12.png",
  },
  {
    label: "One-Tap Directions",
    title:
      "Guests can open your venue directly in Google Maps with a single tap.",
    icon: "/feature_icon/11.png",
  },
  {
    label: "Save the Date",
    title:
      'Let guests add wedding events to their phone calendar instantly.',
    icon: "/feature_icon/10.png",
  },
];

export default function FeaturesShowcase() {
  return (
    <section className="relative bg-white text-black">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          {/* Left Column - Scrolls Normally */}
          <div className="lg:sticky lg:top-30 lg:h-fit">
            <div className="space-y-1">
              {/* Badge */}
              <div>
                <span className="inline-flex mb-1 rounded border border-black/20 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-black/70">
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

                Smarter than a printed card. More elegant than a WhatsApp message. Built for the beautiful chaos of your big day.
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
                  className="sticky md:top-20  overflow-hidden transition-all duration-300  pt-4 pb-6 md:py-10 px-0 bg-white"
                  style={{ zIndex: index }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-10">
                    {/* Icon */}
                    <div className="flex shrink-0 items-start justify-start sm:pt-1">
                      <div className="h-32 w-32 sm:h-30 sm:w-30 lg:h-40 lg:w-40 relative transition duration-300">
                        <Image
                          src={feature.icon}
                          alt={feature.label}
                          width={200}
                          height={200}
                          className="h-full w-full object-contain scale-[2] scale-100"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-start">
                      <h3 className="text-xs font-bold  tracking-[0.15em] text-black mb-2">
                        {feature.label}
                      </h3>
                      <p className="text-2xl font-light leading-tight tracking-tight sm:text-2xl lg:text-3xl text-black">
                        {feature.title}
                      </p>
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
