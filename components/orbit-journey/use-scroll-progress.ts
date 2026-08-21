"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollProgressRef {
  /** Raw 0..1 progress through the pinned container, scrubbed by ScrollTrigger. */
  progress: number;
  /** Normalized scroll speed, roughly 0..1+, decays toward 0 when idle. */
  velocity: number;
}

/**
 * Drives the journey from scroll position without ever triggering a React
 * re-render on scroll — R3F's useFrame reads the ref directly every frame
 * instead. `scrub: 1.5` is what gives the camera its lag/weight; the
 * component consuming this ref can lerp further for extra smoothing.
 */
export function useScrollProgress(containerRef: React.RefObject<HTMLElement | null>) {
  const ref = React.useRef<ScrollProgressRef>({ progress: 0, velocity: 0 });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
          ref.current.progress = self.progress;
          // getVelocity() is in scroll-px/sec; squash into a friendly ~0..1 range.
          ref.current.velocity = gsap.utils.clamp(0, 2, Math.abs(self.getVelocity()) / 2000);
        },
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);

  return ref;
}
