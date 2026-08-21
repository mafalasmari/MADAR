"use client";

import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * SSR-safe prefers-reduced-motion, via useSyncExternalStore — the API
 * React 18+ provides specifically for reading a client-only external value
 * (here, a media query) without the hydration mismatch that a naive
 * useState+useEffect(matchMedia) reproduction would produce: React
 * reconciles the getServerSnapshot/getSnapshot difference on its own right
 * after hydration instead of complaining about mismatched server HTML.
 */
export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
