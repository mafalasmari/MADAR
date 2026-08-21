"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { STAGE_STARTS } from "./camera-path";
import type { ScrollProgressRef } from "./use-scroll-progress";
import { localProgress } from "./progress-utils";

const STAGE_END = 1;

/**
 * Reads the scroll-progress ref directly in its own rAF loop and writes
 * opacity/transform straight to the DOM — text doesn't need 60fps 3D-grade
 * precision, but it does need to stay off the React render path so five
 * screens of scrolling never triggers a re-render.
 */
export function CaptionOverlay({ progressRef }: { progressRef: React.RefObject<ScrollProgressRef> }) {
  const t = useTranslations("journey");
  const stageRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

  const stages = React.useMemo(
    () =>
      [0, 1, 2, 3, 4].map((i) => ({
        eyebrow: t(`stages.${i}.eyebrow`),
        title: t(`stages.${i}.title`),
        desc: t(`stages.${i}.desc`),
      })),
    [t],
  );

  React.useEffect(() => {
    let raf = 0;
    const bounds = [...STAGE_STARTS, STAGE_END];

    const tick = () => {
      const p = progressRef.current.progress;
      stages.forEach((_, i) => {
        const start = bounds[i];
        const end = bounds[i + 1];
        const holdEnd = end - (end - start) * 0.22;
        const fadeIn = localProgress(p, start, start + (end - start) * 0.18);
        const fadeOut = 1 - localProgress(p, holdEnd, end);
        const opacity = Math.min(fadeIn, fadeOut);

        const el = stageRefs.current[i];
        if (el) {
          el.style.opacity = String(opacity);
          el.style.transform = `translateY(${(1 - fadeIn) * 14}px)`;
        }
        const dot = dotRefs.current[i];
        if (dot) {
          const active = p >= start && p < end;
          dot.style.opacity = active ? "1" : "0.3";
          dot.style.width = active ? "28px" : "8px";
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef, stages]);

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end">
      <div className="relative px-6 pb-16 sm:px-12 sm:pb-24">
        {stages.map((stage, i) => (
          <div
            key={i}
            ref={(el) => {
              stageRefs.current[i] = el;
            }}
            className="absolute inset-x-6 bottom-16 max-w-xl sm:inset-x-12 sm:bottom-24"
            style={{ opacity: 0, willChange: "opacity, transform" }}
          >
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-madar-amber uppercase">
              {stage.eyebrow}
            </p>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">{stage.title}</h3>
            <p className="mt-2 max-w-md text-sm text-madar-on-navy-muted sm:text-base">
              {stage.desc}
            </p>
          </div>
        ))}

        <div className="mt-2 flex gap-2">
          {stages.map((_, i) => (
            <span
              key={i}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className="h-1.5 rounded-full bg-madar-amber transition-[width] duration-300"
              style={{ width: "8px", opacity: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
