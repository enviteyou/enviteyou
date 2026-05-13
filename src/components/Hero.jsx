"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const SLIDES = [
  {
    src: "/1.png",
    title: "Bride and Groom",
  },
  {
    src: "/2.png",
    title: "Countdown Begins",
  },
  {
    src: "/3.png",
    title: "Lanterns",
  },
  {
    src: "/4.png",
    title: "Arbishek",
  },
  {
    src: "/5.png",
    title: "Shaadi",
  },
  {
    src: "/6.png",
    title: "Kanika",
  },
];

function LinearCard({ src, title, style, isActive }) {
  return (
    <div
      className="overflow-hidden rounded-md  bg-white shadow-[0_28px_80px_rgba(0,0,0,0.24)]"
      style={style}
    >
      <div className="relative h-full w-full bg-white">
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-width: 768px) 80vw, 360px"
          className="object-cover"
          priority={isActive}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_28%,rgba(0,0,0,0.04)_100%)]" />
    </div>
  );
}

export default function Hero() {
  const trackRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const track = trackRef.current;
    if (!track || prefersReducedMotion) return undefined;

    const gsap = require("gsap").default || require("gsap");

    const cards = Array.from(track.children);
    if (!cards.length) return undefined;

    // Based on the Framer reference: 12 cards forming a full 3D cylinder
    const numCards = 12; 
    const anglePerCard = 360 / numCards; // 30 degrees
    
    // We use a radius that allows the cards to form a nice tight circle
    // Standard formula: radius = (width / 2) / Math.tan(PI / numCards)
    // For 260px width, radius is about 500px. Let's use 650px for some gap.
    let currentAngle = 0;

    const update = (time, deltaTime) => {
      // Positive rotation moves the back-wall cards from right to left
      currentAngle += deltaTime * 0.015; 

      gsap.set(track, { 
        rotationY: currentAngle,
        // Pull the cylinder forward so the center cards (which are pushed back) are larger
        z: 300 
      });
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <section id="how-it-works" className="relative isolate overflow-hidden bg-white text-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.06),transparent_68%)] blur-3xl" />
        <div className="absolute -right-32 top-24 h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.22),transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-40 left-1/2 h-104 w-104 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_66%)] blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-1px)] w-full flex-col px-5 pb-0 sm:px-8 lg:px-10">
        <div className="flex flex-1 flex-col items-center justify-start pt-8 text-center sm:pt-10 lg:pt-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-black/50">Welcome to</p>
          
          <h1 className="mt-2 max-w-5xl text-4xl font-bold leading-tight tracking-tight text-black min-[380px]:text-5xl sm:text-6xl lg:text-7xl">
            Elegant Wedding
            <br />
            <span className="bg-linear-to-r from-black via-black/80 to-black/60 bg-clip-text text-transparent">
              Invitations
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-black/65 sm:text-base sm:leading-7">
            Beautifully crafted, instantly customizable invitation templates.
            <br className="hidden sm:block" />Make your big day unforgettable from the first message.
          </p>

          <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
            <button className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-black/90 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
              Choose a template
            </button>
            <button className="rounded-full border-2 border-black/20 px-7 py-3 text-sm font-semibold text-black transition duration-300 hover:border-black hover:bg-black/5">
              Explore Gallery
            </button>
          </div>
        </div>

        <div className="relative left-1/2 mt-4 flex min-h-72 w-screen -translate-x-1/2 items-center justify-center overflow-hidden sm:min-h-88 lg:mt-6">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-56 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.18),transparent_68%)] blur-3xl" />

          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0)_100%)] z-10 sm:w-36" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[linear-gradient(270deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0)_100%)] z-10 sm:w-36" />

          {/* 3D Scene Container */}
          <div className="relative h-72 w-screen sm:h-88 lg:h-96" style={{ perspective: "1000px" }}>
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white via-white/70 to-transparent z-10 sm:w-40" />
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-white via-white/70 to-transparent z-10 sm:w-40" />

            {/* Rotating Cylinder Track */}
            <div
              ref={trackRef}
              className="absolute left-1/2 top-1/2"
              style={{ transformStyle: "preserve-3d" }}
            >
              {[...SLIDES, ...SLIDES].map((slide, index) => {
                return (
                  <div
                    key={`${slide.src}-${index}`}
                    style={{
                      position: "absolute",
                      // Center the card around the track's origin axis
                      left: "-130px", // Assuming width ~260px
                      top: "-170px",  // Assuming height ~340px
                      width: "260px",
                      height: "340px",
                      transformStyle: "preserve-3d",
                      // NEGATIVE translateZ creates the bioscope/concave funnel!
                      transform: `rotateY(${index * 30}deg) translateZ(-650px)`,
                      // Hides the front half of the cylinder so we only see the back wall curving around us
                      backfaceVisibility: "hidden", 
                    }}
                  >
                    <LinearCard
                      src={slide.src}
                      title={slide.title}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
