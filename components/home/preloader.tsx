"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { MadarLogo } from "@/components/brand/MadarLogo";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const SESSION_KEY = "madar-preloader-seen";
const RING_DRAW_MS = 900;
const LOGO_FADE_DELAY_MS = 500;
const HOLD_MS = 900;

function subscribe() {
  return () => {};
}
function getSnapshot() {
  try {
    return sessionStorage.getItem(SESSION_KEY) !== "1";
  } catch {
    // sessionStorage unavailable (privacy mode, etc.) — treat as unseen.
    return true;
  }
}
function getServerSnapshot() {
  return false;
}

/**
 * Section 0 — a one-time entrance: the orbit ring draws itself, then the
 * Madar mark fades in over it, then the whole thing dissolves to reveal the
 * page. Shown once per browser tab (via sessionStorage, read through
 * useSyncExternalStore the same SSR-safe way useReducedMotion is — the
 * server snapshot always says "already seen" so nothing plays before
 * hydration), and skipped entirely for reduced motion.
 */
export function Preloader() {
  const prefersReducedMotion = useReducedMotion();
  const notSeenYet = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = React.useState(false);
  const shouldShow = notSeenYet && !prefersReducedMotion && !dismissed;

  React.useEffect(() => {
    if (!shouldShow) return;
    const timer = setTimeout(() => {
      setDismissed(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Best-effort only — worst case the intro replays once more.
      }
    }, RING_DRAW_MS + LOGO_FADE_DELAY_MS + HOLD_MS);
    return () => clearTimeout(timer);
  }, [shouldShow]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-100 grid place-items-center bg-madar-navy"
          aria-hidden="true"
        >
          <div className="relative grid size-40 place-items-center sm:size-48">
            <svg viewBox="0 0 200 200" className="absolute inset-0">
              <circle
                cx={100}
                cy={100}
                r={88}
                fill="none"
                stroke="#1B75BB"
                strokeWidth={2}
                opacity={0.25}
              />
              <motion.circle
                cx={100}
                cy={100}
                r={88}
                fill="none"
                stroke="#F5A623"
                strokeWidth={2.5}
                strokeLinecap="round"
                pathLength={1}
                initial={{ strokeDasharray: "0 1" }}
                animate={{ strokeDasharray: "1 1" }}
                transition={{ duration: RING_DRAW_MS / 1000, ease: [0.65, 0, 0.35, 1] }}
                transform="rotate(-90 100 100)"
              />
            </svg>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: LOGO_FADE_DELAY_MS / 1000 }}
              className="w-24 sm:w-28"
            >
              <MadarLogo variant="reversed" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
