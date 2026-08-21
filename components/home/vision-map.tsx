"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Stage {
  code: string;
  place: string;
  desc: string;
  status: string;
}

/**
 * The brand's own visual concept, literally: "مدار" means orbit — things
 * moving around one fixed center. So the expansion map isn't a geographic
 * illustration; it's concentric orbits drawn outward from Riyadh as the
 * user scrolls, each ring one stage of the roadmap.
 */
const RINGS = [
  { r: 60, color: "#F5A623" },
  { r: 100, color: "#1B75BB" },
  { r: 140, color: "#9DB1C0" },
];

function OrbitDiagram() {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const circles = svg.querySelectorAll("[data-ring]");
      circles.forEach((circle, i) => {
        const circumference = 2 * Math.PI * RINGS[i].r;
        gsap.set(circle, { strokeDasharray: circumference, strokeDashoffset: reduceMotion ? 0 : circumference });
        if (reduceMotion) return;
        gsap.to(circle, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: svg,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.6,
          },
          delay: i * 0.1,
        });
      });
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 320 320"
      className="mx-auto w-full max-w-md"
      role="img"
      aria-hidden="true"
    >
      {RINGS.map((ring, i) => (
        <circle
          key={i}
          data-ring
          cx={160}
          cy={160}
          r={ring.r}
          fill="none"
          stroke={ring.color}
          strokeWidth={2}
          strokeLinecap="round"
          transform="rotate(-90 160 160)"
        />
      ))}
      <circle cx={160} cy={160} r={7} fill="#F5A623" />
      <circle cx={160} cy={160} r={14} fill="none" stroke="#F5A623" strokeWidth={1} opacity={0.4} />
    </svg>
  );
}

export function VisionMap() {
  const t = useTranslations("home.vision");
  const stages = t.raw("stages") as Stage[];
  const ringColors = ["text-madar-amber", "text-madar-trade-blue", "text-madar-on-navy-muted"];

  return (
    <section className="bg-madar-navy py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          tone="dark"
          className="mx-auto"
        />

        <div className="mt-12">
          <OrbitDiagram />
        </div>

        <div className="mx-auto mt-4 grid max-w-4xl gap-5 sm:grid-cols-3">
          {stages.map((stage, i) => (
            <ScrollReveal
              key={stage.code}
              delay={i * 0.1}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
              <p className={`text-3xl font-bold ${ringColors[i]}`}>{stage.code}</p>
              <p className="mt-3 text-lg font-bold text-white">{stage.place}</p>
              <p className="mt-1.5 text-sm text-madar-on-navy-muted">{stage.desc}</p>
              <p className="mt-4 text-xs font-bold tracking-wide text-madar-amber uppercase">
                {stage.status}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
