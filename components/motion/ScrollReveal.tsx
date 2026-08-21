"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";

import { useReducedMotion } from "@/lib/use-reduced-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds, useful for a row/grid of ScrollReveal siblings. */
  delay?: number;
  /** Pixels to travel on entry. Kept small deliberately — "ليس مبالغًا فيه". */
  distance?: number;
  as?: "div" | "li";
}

/** Fade + slight upward motion, once, when a section scrolls into view. */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 24,
  as = "div",
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
