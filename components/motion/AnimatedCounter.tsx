"use client";

import * as React from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

import { useReducedMotion } from "@/lib/use-reduced-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

/**
 * Counts up from 0 to `value` once it scrolls into view — or jumps straight
 * there in one frame under reduced motion. Both paths go through the same
 * animate()-in-an-effect pipeline (duration 0 vs. duration N) so the
 * rendered value is always `display` state seeded at 0 on both server and
 * client: nothing here depends on a client-only value during the first
 * render, so there's nothing for hydration to mismatch on.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  className,
  duration = 1.4,
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionValue, value, {
      duration: reduceMotion ? 0 : duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, value, duration, motionValue, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
