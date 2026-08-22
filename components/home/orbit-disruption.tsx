"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CENTER = { x: 200, y: 150 };
const RING_RADIUS = 92;

/**
 * Evenly spaced points on the ring — the "intact orbit" formation.
 * Pre-computed rather than derived from Math.cos/sin at module-eval time:
 * trig results can differ in their last bit between the server's V8 and
 * the browser's, which — once serialized to a decimal string of different
 * length — reads to React as a client/server hydration mismatch.
 */
const RING_POSITIONS = [
  { x: 200, y: 58 }, { x: 254.1, y: 75.6 }, { x: 287.5, y: 121.6 },
  { x: 287.5, y: 178.4 }, { x: 254.1, y: 224.4 }, { x: 200, y: 242 },
  { x: 145.9, y: 224.4 }, { x: 112.5, y: 178.4 }, { x: 112.5, y: 121.6 },
  { x: 145.9, y: 75.6 },
];

/** Hand-placed, irregular positions — the "scattered / broken" formation. */
const SCATTER_POSITIONS = [
  { x: 48, y: 58 }, { x: 340, y: 44 }, { x: 96, y: 210 },
  { x: 300, y: 232 }, { x: 190, y: 34 }, { x: 24, y: 150 },
  { x: 372, y: 140 }, { x: 150, y: 262 }, { x: 250, y: 96 },
  { x: 60, y: 260 },
];

interface OrbitDisruptionProps {
  /** "scatter": starts as a perfect ring, breaks apart on scroll-in (Problem). */
  variant: "scatter" | "reform";
  className?: string;
}

/**
 * The brand's orbit motif under stress: the same ten nodes either fly apart
 * into disorder (Section 2, the fragmented market) or snap back into the
 * perfect ring (Section 3, the unified Madar orbit). One shared component,
 * driven by GSAP ScrollTrigger the same way the rest of the site's scroll
 * reveals are — no Three.js, so it costs nothing next to the real 3D
 * journey lower on the page.
 */
export function OrbitDisruption({ variant, className }: OrbitDisruptionProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const isScatter = variant === "scatter";
  const from = isScatter ? RING_POSITIONS : SCATTER_POSITIONS;
  const to = isScatter ? SCATTER_POSITIONS : RING_POSITIONS;

  React.useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const nodes = svg.querySelectorAll<SVGCircleElement>("[data-orbit-node]");
      const ring = svg.querySelector<SVGCircleElement>("[data-orbit-ring]");

      if (reduceMotion) {
        nodes.forEach((node, i) => {
          gsap.set(node, { attr: { cx: to[i].x, cy: to[i].y } });
        });
        gsap.set(ring, { opacity: isScatter ? 0 : 1 });
        return;
      }

      nodes.forEach((node, i) => {
        gsap.set(node, { attr: { cx: from[i].x, cy: from[i].y } });
      });
      gsap.set(ring, { opacity: isScatter ? 1 : 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 75%", once: true },
      });

      nodes.forEach((node, i) => {
        tl.to(
          node,
          { attr: { cx: to[i].x, cy: to[i].y }, duration: 1.1, ease: "power3.out" },
          i * 0.045,
        );
      });
      tl.to(ring, { opacity: isScatter ? 0 : 1, duration: 0.8, ease: "power3.out" }, isScatter ? 0 : 0.35);
    }, svg);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- from/to are derived from `variant`, already a dep
  }, [variant]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <circle
        data-orbit-ring
        cx={CENTER.x}
        cy={CENTER.y}
        r={RING_RADIUS}
        fill="none"
        stroke="#1B75BB"
        strokeWidth={1.5}
        strokeDasharray="4 8"
        opacity={isScatter ? 1 : 0}
      />
      <circle cx={CENTER.x} cy={CENTER.y} r={6} fill="#F5A623" opacity={0.85} />

      {from.map((pos, i) => (
        <circle
          key={i}
          data-orbit-node
          cx={pos.x}
          cy={pos.y}
          r={i % 3 === 0 ? 7 : 5}
          fill={isScatter ? "#F5A623" : "#1B75BB"}
          className="madar-flow-node"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </svg>
  );
}
