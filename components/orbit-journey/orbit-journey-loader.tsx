"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import { getDeviceTier } from "@/lib/device-tier";
import { JourneyFallback } from "./journey-fallback";

// Three.js/WebGL only ever runs client-side — ssr:false is required here,
// which in turn requires this indirection through a Client Component (the
// parent page stays a Server Component and just renders this).
const OrbitJourney3D = dynamic(
  () => import("./orbit-journey").then((mod) => mod.OrbitJourney),
  { ssr: false, loading: () => null },
);

function subscribe() {
  return () => {};
}

/**
 * getServerSnapshot deliberately says "no WebGL" — not because the server
 * knows that, but so neither the server nor the client's first paint ever
 * renders (and thereby triggers the code-split import of) OrbitJourney3D
 * before we've actually confirmed the device can use it. Once mounted,
 * getSnapshot reads the real tier and — for capable devices — swaps in
 * the 3D journey; 'none'-tier visitors (no WebGL, or reduced motion) just
 * keep the static fallback they were already looking at, and never
 * download the ~1MB Three.js chunk at all.
 */
function getSnapshot() {
  return getDeviceTier() !== "none";
}

function getServerSnapshot() {
  return false;
}

export function OrbitJourneyLoader() {
  const needsWebgl = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!needsWebgl) {
    return <JourneyFallback />;
  }

  return (
    <div style={{ minHeight: "550vh" }}>
      <OrbitJourney3D />
    </div>
  );
}
