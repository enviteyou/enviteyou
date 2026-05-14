"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const SLIDES = [
  { src: "/1.png", title: "Bride and Groom" },
  { src: "/2.png", title: "Countdown Begins" },
  { src: "/3.png", title: "Lanterns" },
  { src: "/4.png", title: "Arbishek" },
  { src: "/5.png", title: "Shaadi" },
  { src: "/6.png", title: "Kanika" },
];

const DOUBLE_SLIDES = [...SLIDES, ...SLIDES];
const NUM_CARDS = DOUBLE_SLIDES.length;
const ANGLE_PER_CARD = 360 / NUM_CARDS;
const CATEGORIES = [
  "All",
  "Hindu Weddings",
  "Christian Weddings",
  "Sikh Weddings",
  "Muslim Weddings",
  "South-Indian Weddings",
  "Save the date",
];

// Pre-calculate static 3D styles to avoid re-rendering allocation overhead
const SLIDE_STYLES = DOUBLE_SLIDES.map((_, index) => ({
  position: "absolute",
  left: "-150px", // Center offset for 260px width
  top: "-200px",  // Center offset for 340px height
  width: "300px",
  height: "400px",
  transformStyle: "preserve-3d",
  transform: `rotateY(${index * ANGLE_PER_CARD}deg) translateZ(-650px)`,
  backfaceVisibility: "hidden",
}));

function LinearCard({ src, title, isActive }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-md bg-white shadow-[0_28px_80px_rgba(0,0,0,0.24)]">
      <div className="relative h-full w-full bg-white">
        <Image
          src={src}
          alt={title}
          fill
          sizes="280px"
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

    let currentAngle = 0;

    // Performance: Use quickSetter to bypass standard property lookups
    const setRotationY = gsap.quickSetter(track, "rotationY", "deg");
    const setZ = gsap.quickSetter(track, "z", "px");

    let targetZ = window.innerWidth < 640 ? -350 : 500;
    setZ(targetZ);

    // Performance: Only check viewport bounds on resize, not every frame
    const handleResize = () => {
      targetZ = window.innerWidth < 640 ? -350 : 500;
      setZ(targetZ);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const update = (time, deltaTime) => {
      currentAngle += deltaTime * 0.015;
      setRotationY(currentAngle);
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section id="how-it-works" className="relative isolate overflow-hidden bg-white text-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.06),transparent_68%)] blur-3xl" />
        <div className="absolute -right-32 top-24 h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.22),transparent_70%)] blur-3xl" />
        {/* <div className="absolute -bottom-40 left-1/2 h-104 w-104 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_66%)] blur-3xl" /> */}
      </div>

      <div className="mx-auto flex  w-full flex-col px-5 pb-0 md:px-10">
        <div className="order-2 flex flex-col items-center justify-start pt-8 text-center md:order-1 md:pt-12">
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
            <button className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1">
              Choose a template
            </button>
            <button className="rounded-full border-2 border-black/20 px-7 py-3 text-sm font-semibold text-black transition duration-300 hover:border-black hover:bg-black/5">
              Explore Gallery
            </button>
          </div>
        </div>

        <div className="order-1 relative left-1/2 mt-4 flex w-screen -translate-x-1/2 items-center justify-center overflow-hidden md:order-2 md:mt-6">
          <div className="pointer-events-none absolute inset-x-0 top-1/2  -translate-y-1/2 rounded-full blur-3xl" />

          {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0)_100%)] z-10 sm:w-36" /> */}
          {/* <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-[linear-gradient(270deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0)_100%)] z-10 sm:w-36" /> */}

          {/* 3D Scene Container */}
          <div className="relative h-72 w-screen md:h-130" style={{ perspective: "1000px" }}>
            <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-white via-white/70 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-white via-white/70 to-transparent z-10" />

            {/* Rotating Cylinder Track */}
            <div
              ref={trackRef}
              className="absolute left-1/2 top-1/2"
              style={{ transformStyle: "preserve-3d" }}
            >
              {DOUBLE_SLIDES.map((slide, index) => (
                <div key={`${slide.src}-${index}`} style={SLIDE_STYLES[index]}>
                  <LinearCard src={slide.src} title={slide.title} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-3 border-t border-black/10">
          <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-10 md:py-10">
            <div className="mb-5 flex">
              <div className="rounded-sm border border-black/25 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-black/70">
                New Releases
              </div>
            </div>
            <h2 className="mx-auto max-w-3xl text-center text-2xl font-bold leading-tight tracking-tight text-black sm:text-3xl">
              Designed for your BIG day. Easy-to-edit. Effortless to Share.
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-black/60">
              Pick a style. Add your story. Share in minutes
            </p>
          </div>
          <div className="mx-auto w-full max-w-6xl border-t border-black/10 px-5 py-6 md:px-10">
            <p className="text-center text-sm font-medium text-black/60">Select Category</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
              {CATEGORIES.map((category, index) => (
                <button
                  key={category}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition duration-300 md:px-5 md:py-2.5 md:text-base ${
                    index === 0
                      ? "bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                      : "bg-white text-black/85 shadow-[0_10px_24px_rgba(0,0,0,0.06)] ring-1 ring-black/8 hover:-translate-y-0.5 hover:ring-black/15"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
