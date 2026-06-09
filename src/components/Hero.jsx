"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
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

// Group 12 slides into 6 arms (opposite pairs)
const ARMS_DATA = [];
for (let i = 0; i < 6; i++) {
  ARMS_DATA.push({
    angle: i * 30,
    slideRight: DOUBLE_SLIDES[i],
    slideLeft: DOUBLE_SLIDES[i + 6],
    indexRight: i,
    indexLeft: i + 6,
  });
}

function LinearCard({ src, title, isActive }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-md bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
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

    // Use GSAP quickSetters for high performance 3D rotation and depth placement
    const setRotationY = gsap.quickSetter(track, "rotationY", "deg");
    const setZ = gsap.quickSetter(track, "z", "px");

    // Dynamic depth positioning of the cylinder center relative to viewport width
    let targetZ = window.innerWidth < 640 ? -50 : -100;
    setZ(targetZ);

    const handleResize = () => {
      targetZ = window.innerWidth < 640 ? -50 : -100;
      setZ(targetZ);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Select the 12 card elements to apply dynamic depth/blur/shading effects
    const cards = track.querySelectorAll(".carousel-card");
    const cardElements = Array.from(cards).map(card => {
      const baseAngle = parseFloat(card.getAttribute("data-angle"));
      return {
        element: card,
        baseAngle,
      };
    });

    const update = (time, deltaTime) => {
      // Rotate 0.008 degrees per millisecond (approx 28.8 degrees per second)
      currentAngle += deltaTime * 0.008;
      setRotationY(currentAngle);

      // Apply dynamic depth features based on current world-space Y rotation of each card
      cardElements.forEach(item => {
        // Adjust with -90 degree phase shift to align focus with the front center card
        const cardWorldAngle = currentAngle + item.baseAngle - 90;
        const rad = cardWorldAngle * Math.PI / 180;
        const cosVal = Math.cos(rad);

        // depthFactor: 0.0 at center-front (cosVal = 1), 1.0 at center-back (cosVal = -1)
        const depthFactor = (1 - cosVal) / 2;

        const scale = 1.12 - 0.32 * depthFactor;
        const opacity = 1 - 0.8 * depthFactor;
        const blurAmount = 8 * depthFactor;
        const brightnessAmount = 1 - 0.7 * depthFactor;

        // Directly manipulate DOM style properties for highest performance, bypass wrapper overhead
        item.element.style.transform = `scale(${scale})`;
        item.element.style.opacity = opacity;
        item.element.style.filter = `blur(${blurAmount}px) brightness(${brightnessAmount})`;
      });
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section id="how-it-works" className="relative isolate overflow-hidden bg-white text-black hero-carousel-section">
      {/* Scope responsive styles using CSS variables for clean viewport sizing */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .hero-carousel-section {
          --carousel-radius: 650px;
          --card-width: 280px;
          --card-height: 380px;
        }
        @media (max-width: 1024px) {
          .hero-carousel-section {
            --carousel-radius: 500px;
            --card-width: 220px;
            --card-height: 300px;
          }
        }
        @media (max-width: 768px) {
          .hero-carousel-section {
            --carousel-radius: 380px;
            --card-width: 180px;
            --card-height: 250px;
          }
        }
        @media (max-width: 480px) {
          .hero-carousel-section {
            --carousel-radius: 230px;
            --card-width: 120px;
            --card-height: 170px;
          }
        }
      `}} />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.06),transparent_68%)] blur-3xl" />
        <div className="absolute -right-32 top-24 h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.22),transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto flex w-full flex-col px-5 pb-0 md:px-10">
        <div className="order-2 flex flex-col items-center justify-start pt-8 text-center md:order-1 md:pt-12">
          <p className="text-xs font-semibold tracking-widest text-black/50">Pay Once. No Expiry. No Hidden Fees.</p>

          <h1 className="mt-2 max-w-5xl text-xl font-bold leading-tight tracking-normal text-black min-[380px]:text-5xl sm:text-5xl lg:text-6xl">
            Build Your Wedding Website, Online Forever.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-black/65 sm:text-base sm:leading-7">
            Create in minutes. Invitations,
            <br className="hidden sm:block" />RSVP, photos, and memories—all in one place.
          </p>

          <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
            <button onClick={() => window.location.href = "/templates"} className="rounded-full bg-black px-7 py-3 cursor-pointer text-sm font-semibold text-white transition duration-300 hover:-translate-y-1">
              Explore Templates
            </button>
          </div>
        </div>

        <div className="order-1 relative left-1/2 mt-4 flex w-screen -translate-x-1/2 items-center justify-center overflow-hidden md:order-2 md:mt-6">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full blur-3xl" />

          {/* 3D Scene Viewport Container */}
          <div
            className="relative w-screen overflow-hidden flex items-center justify-center"
            style={{
              height: "calc(var(--card-height) + 80px)",
              perspective: "1000px",
              transformStyle: "preserve-3d"
            }}
          >
            <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-white via-white/70 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-white via-white/70 to-transparent z-10" />

            {/* Rotating 3D Cylinder Track */}
            <div
              ref={trackRef}
              className="absolute left-1/2 top-1/2"
              style={{ transformStyle: "preserve-3d" }}
            >
              {ARMS_DATA.map((arm, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: "calc(2 * var(--carousel-radius))",
                    height: "var(--card-height)",
                    transform: `translate(-50%, -50%) rotateY(${arm.angle}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Right Card Slot (faces outward) */}
                  <div
                    className="absolute right-0 top-0"
                    style={{
                      width: "var(--card-width)",
                      height: "var(--card-height)",
                      transform: "translate(50%, 0) rotateY(-90deg)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div
                      className="carousel-card h-full w-full"
                      data-angle={arm.angle}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <LinearCard src={arm.slideRight.src} title={arm.slideRight.title} />
                    </div>
                  </div>

                  {/* Left Card Slot (faces outward) */}
                  <div
                    className="absolute left-0 top-0"
                    style={{
                      width: "var(--card-width)",
                      height: "var(--card-height)",
                      transform: "translate(-50%, 0) rotateY(90deg)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div
                      className="carousel-card h-full w-full"
                      data-angle={arm.angle + 180}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <LinearCard src={arm.slideLeft.src} title={arm.slideLeft.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
