"use client";

import * as React from "react";
import { useInView, useMotionValue, useReducedMotion, animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

/** Counts up from 0 to `value` once it scrolls into view. */
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
    // Reduced motion skips the animation entirely — nothing to synchronize,
    // so it's handled in the render below instead of here.
    if (!isInView || reduceMotion) return;
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, value, duration, motionValue, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {reduceMotion ? value : display}
      {suffix}
    </span>
  );
}
