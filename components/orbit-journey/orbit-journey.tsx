"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Canvas } from "@react-three/fiber";

import { getDeviceTier, type DeviceTier } from "@/lib/device-tier";
import { useScrollProgress } from "./use-scroll-progress";
import { Scene } from "./scene";
import { TIER_SETTINGS } from "./tier-config";
import { CaptionOverlay } from "./caption-overlay";
import { JourneyFallback } from "./journey-fallback";

/** Total scroll distance the journey plays over — ~5.5 screens for 5 stages. */
const JOURNEY_HEIGHT_VH = 550;

/**
 * Only ever mounted for a tier that OrbitJourneyLoader has already
 * confirmed is WebGL-capable — 'none'-tier visitors get JourneyFallback
 * straight from the loader and never pay for this component's (Three.js-
 * heavy) code-split chunk at all. The one thing that can't be known
 * upfront is a context loss mid-session, so that's still handled here,
 * falling back to the same static timeline.
 */
export function OrbitJourney() {
  const locale = useLocale();
  const mirrored = locale === "ar";
  const t = useTranslations("journey");

  const [tier] = React.useState<Exclude<DeviceTier, "none">>(() => {
    const detected = getDeviceTier();
    return detected === "none" ? "low" : detected;
  });
  const [webglFailed, setWebglFailed] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const progressRef = useScrollProgress(containerRef);

  if (webglFailed) {
    return <JourneyFallback />;
  }

  return (
    <section
      ref={containerRef}
      aria-label={t("sectionLabel")}
      style={{ height: `${JOURNEY_HEIGHT_VH}vh` }}
      className="relative bg-madar-navy"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas
          dpr={TIER_SETTINGS[tier].dpr}
          gl={{ antialias: tier !== "low", powerPreference: "high-performance" }}
          camera={{ fov: 50, near: 0.1, far: 60 }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => {
                e.preventDefault();
                setWebglFailed(true);
              },
              { once: true },
            );
          }}
        >
          <React.Suspense fallback={null}>
            <Scene progressRef={progressRef} mirrored={mirrored} settings={TIER_SETTINGS[tier]} />
          </React.Suspense>
        </Canvas>

        <CaptionOverlay progressRef={progressRef} />
      </div>
    </section>
  );
}
