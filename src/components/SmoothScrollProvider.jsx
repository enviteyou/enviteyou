"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function SmoothScrollUpdate() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Disable lagSmoothing so GSAP ticker updates scroll and animations in the exact same frame
    gsap.ticker.lagSmoothing(0);

    // 1. Sync ScrollTrigger updates on scroll events
    lenis.on("scroll", ScrollTrigger.update);

    // 2. Drive Lenis updates using GSAP's ticker (since autoRaf={false})
    function update(time) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
      // Restore default lag smoothing on unmount
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScrollProvider({ children }) {
  return (
    <ReactLenis root autoRaf={false}>
      <SmoothScrollUpdate />
      {children}
    </ReactLenis>
  );
}
