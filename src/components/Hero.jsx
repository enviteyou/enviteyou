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
      className="absolute overflow-hidden rounded-[1.85rem] border border-white/70 bg-white shadow-[0_28px_80px_rgba(0,0,0,0.24)]"
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
  const offsetRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const track = trackRef.current;
    if (!track) return undefined;

    const setTransform = () => {
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      track.style.willChange = "transform";
    };

    setTransform();
    if (prefersReducedMotion) return undefined;

    let frame = 0;
    let lastTime = performance.now();

    const animate = (time) => {
      const delta = Math.min(32, time - lastTime);
      lastTime = time;
      offsetRef.current -= delta * 0.06;
      const cardWidth = 266;
      const gap = 24;
      const cycleWidth = SLIDES.length * (cardWidth + gap);

      if (Math.abs(offsetRef.current) >= cycleWidth) {
        offsetRef.current += cycleWidth;
      }

      setTransform();
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-white text-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.06),transparent_68%)] blur-3xl" />
        <div className="absolute -right-32 top-24 h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.22),transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-40 left-1/2 h-104 w-104 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_66%)] blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-1px)] w-full flex-col px-5 pb-0 sm:px-8 lg:px-10">
        <div className="flex flex-1 flex-col items-center justify-center pt-16 text-center sm:pt-20 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-black/50">Welcome to</p>
          
          <h1 className="mt-3 max-w-5xl text-7xl font-bold leading-tight tracking-tight text-black">
            Elegant Wedding
            <br />
            <span className="bg-gradient-to-r from-black via-black/80 to-black/60 bg-clip-text text-transparent">
              Invitations
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-7 text-black/65">
            Beautifully crafted, instantly customizable invitation templates.
            <br />Make your big day unforgettable from the first message.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <button className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-black/90 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
            Choose a template
          </button>
          <button className="rounded-full border-2 border-black/20 px-8 py-3 text-sm font-semibold text-black transition duration-300 hover:border-black hover:bg-black/5">
            Explore Gallery
          </button>
          </div>
        </div>

        <div className="relative left-1/2 mt-12 flex min-h-136 w-screen -translate-x-1/2 items-center justify-center overflow-hidden lg:mt-16">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-56 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.18),transparent_68%)] blur-3xl" />

          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0)_100%)] sm:w-36" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[linear-gradient(270deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0)_100%)] sm:w-36" />

          <div className="relative h-104 w-screen overflow-hidden sm:h-120 lg:h-136">
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white via-white/70 to-transparent sm:w-40" />
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-white via-white/70 to-transparent sm:w-40" />

            <div
              ref={trackRef}
              className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-6 px-6 sm:px-10 lg:px-14"
              style={{ transform: "translate3d(0, 0, 0) translateY(-50%)", width: "max-content" }}
            >
              {[...SLIDES, ...SLIDES].map((slide, index) => {
                const isActive = index % SLIDES.length === 1;

                return (
                  <LinearCard
                    key={`${slide.src}-${index}`}
                    src={slide.src}
                    title={slide.title}
                    isActive={isActive}
                    style={{
                      width: "clamp(220px, 24vw, 300px)",
                      height: "clamp(310px, 34vw, 430px)",
                      position: "relative",
                      flex: "0 0 auto",
                      transform: index % SLIDES.length === 1 ? "translateY(-10px) rotate(-1deg)" : "translateY(0) rotate(0deg)",
                      transition: "transform 500ms ease, opacity 500ms ease",
                      opacity: index % SLIDES.length === 1 ? 1 : 0.86,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
