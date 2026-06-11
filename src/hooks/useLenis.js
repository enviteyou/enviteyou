"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Custom hook to initialize Lenis smooth scrolling and synchronize it with GSAP ScrollTrigger.
 * @param {Object} options Configuration options
 * @param {boolean} options.enabled Whether smooth scrolling is enabled
 */
export default function useLenis({ enabled = true } = {}) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return undefined;

    // Ensure ScrollTrigger is registered
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5, // slightly more responsive on touch devices
    });

    // Sync ScrollTrigger updates with Lenis scroll events
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Use GSAP ticker to run Lenis RAF loop for centralized animation synchronization
    const updatePhysics = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updatePhysics);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updatePhysics);
    };
  }, [enabled]);
}
