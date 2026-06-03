"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Templates from "@/components/Templates";
import Category from "@/components/Category";
const SLIDES = [
  { src: "/1.png", title: "Bride and Groom" },
  { src: "/2.png", title: "Countdown Begins" },
  { src: "/3.png", title: "Lanterns" },
  { src: "/4.png", title: "Arbishek" },
  { src: "/5.png", title: "Shaadi" },
  { src: "/6.png", title: "Kanika" },
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


// Pre-calculate static 3D styles to avoid re-rendering allocation overhead
const SLIDE_STYLES = DOUBLE_SLIDES.map((_, index) => ({
  position: "absolute",
  left: "-150px", // Center offset for 260px width
  top: "-200px",  // Center offset for 340px height
  width: "300px",
  height: "400px",
  transformStyle: "preserve-3d",
  transform: `rotateY(${index * ANGLE_PER_CARD}deg) translateZ(-1350px)`,
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
          className="object-cover rounded-md"
          priority={isActive}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_28%,rgba(0,0,0,0.04)_100%)]" />
    </div>
  );
}

export default function Hero({ templates = [] }) {
  const trackRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");

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
      currentAngle += deltaTime * 0.01; // Rotate at 0.01 degrees per ms (36 degrees per second)
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
          <p className="text-xs font-semibold  tracking-widest text-black/50">Pay Once. No Expiry. No Hidden Fees.</p>

          <h1 className="mt-2 max-w-5xl text-xl font-bold leading-tight tracking-normal text-black min-[380px]:text-5xl sm:text-5xl lg:text-6xl">
            Build Your Wedding Website, Online Forever.


          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-black/65 sm:text-base sm:leading-7">
            Create a beautiful digital wedding website in minutes.
            <br className="hidden sm:block" />Send it to your guests today, and keep it online forever as a digital scrapbook of your big day.
          </p>

          <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
            <button className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1">
              Explore Templates
            </button>

          </div>
        </div>



        <div className="order-1 relative left-1/2 mt-4 flex w-screen -translate-x-1/2 items-center justify-center overflow-hidden md:order-2 md:mt-6">
          <div className="pointer-events-none absolute inset-x-0 top-1/2  -translate-y-1/2 rounded-full blur-3xl" />

          {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0)_100%)] z-10 sm:w-36" /> */}
          {/* <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-[linear-gradient(270deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0)_100%)] z-10 sm:w-36" /> */}

          {/* 3D Scene Container */}
          <div className="relative h-72 w-screen md:h-130" style={{ perspective: "700px" }}>
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
            <div className="mb-5 flex justify-center">
              <div className="rounded-sm border  border-black/25 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-black/70">
                New Releases
              </div>
            </div>
            <h2 className="mx-auto max-w-3xl text-center text-xl font-bold leading-tight tracking-tight text-black sm:text-3xl">
              Built for your big day. Simple to edit. Just type, save, and share.
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-black/60">
              Select your theme. Tell your story. Send it in minutes.
            </p>
          </div>
          <Category activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <Templates templates={templates} activeCategory={activeCategory} />
        </div>
      </div>
    </section>
  );
}
