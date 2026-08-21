"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The Madar wordmark + "smile" — reproduced exactly from the brand system
 * file (viewBox 0 0 900 420; arc `M 205 246 Q 450 330 695 246`; amber start
 * dot at (205,246) r15; arrowhead as two 15pt round-cap strokes out of
 * (695,246)). Geometry and colors are copied verbatim, not re-approximated.
 */
const INK = {
  navy: "#0A3D62",
  white: "#FFFFFF",
  blue: "#1B75BB",
  amber: "#F5A623",
} as const;

export interface MadarLogoProps {
  /** "full" = navy wordmark for light surfaces. "reversed" = white wordmark for navy/dark surfaces. */
  variant?: "full" | "reversed";
  /** Draw the arc/dot/arrow in on mount (used once, in the hero) instead of rendering static. */
  animate?: boolean;
  className?: string;
}

export function MadarLogo({
  variant = "full",
  animate = false,
  className,
}: MadarLogoProps) {
  const prefersReducedMotion = useReducedMotion();
  const wordmarkFill = variant === "reversed" ? INK.white : INK.navy;
  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <svg
      viewBox="0 0 900 420"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="MADAR"
    >
      <motion.text
        x="450"
        y="210"
        fontSize="150"
        fontWeight="900"
        fill={wordmarkFill}
        textAnchor="middle"
        letterSpacing="-4"
        fontFamily="'Arial Black', Arial, sans-serif"
        initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        MADAR
      </motion.text>

      <motion.path
        d="M 205 246 Q 450 330 695 246"
        fill="none"
        stroke={INK.blue}
        strokeWidth={15}
        strokeLinecap="round"
        initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
        animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
      />

      <motion.circle
        cx={205}
        cy={246}
        r={15}
        fill={INK.amber}
        initial={shouldAnimate ? { scale: 0, opacity: 0 } : false}
        animate={shouldAnimate ? { scale: 1, opacity: 1 } : undefined}
        style={{ transformOrigin: "205px 246px" }}
        transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 320, damping: 14 }}
      />

      <motion.path
        d="M 695 246 L 664 236 M 695 246 L 686 268"
        fill="none"
        stroke={INK.blue}
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={shouldAnimate ? { opacity: 0, scale: 0.6 } : false}
        animate={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}
        style={{ transformOrigin: "695px 246px" }}
        transition={{ duration: 0.3, delay: 1.15, ease: "easeOut" }}
      />
    </svg>
  );
}

/** Just the "smile" glyph (arc + dot + arrow), no wordmark — for tight spaces (favicons, loaders, dividers). */
export function MadarSmile({
  className,
  color = INK.blue,
  dotColor = INK.amber,
}: {
  className?: string;
  color?: string;
  dotColor?: string;
}) {
  return (
    <svg viewBox="150 190 600 140" className={cn("h-auto w-full", className)} aria-hidden="true">
      <path
        d="M 205 246 Q 450 330 695 246"
        fill="none"
        stroke={color}
        strokeWidth={15}
        strokeLinecap="round"
      />
      <circle cx={205} cy={246} r={15} fill={dotColor} />
      <path
        d="M 695 246 L 664 236 M 695 246 L 686 268"
        fill="none"
        stroke={color}
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
