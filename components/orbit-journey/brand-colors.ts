import * as THREE from "three";

/**
 * Reads the actual brand tokens defined in app/[locale]/globals.css
 * (--madar-navy, --madar-trade-blue, --madar-amber, --madar-sand) instead
 * of hardcoding a second copy of the palette — this file is the single
 * place those hex values are duplicated as a fallback, only used if the
 * CSS custom properties aren't resolvable (SSR safety net).
 */
const FALLBACK = {
  navy: "#0a3d62",
  tradeBlue: "#1b75bb",
  amber: "#f5a623",
  sand: "#f4f1ea",
  onNavyMuted: "#9db1c0",
};

function readVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

export interface BrandColors {
  navy: THREE.Color;
  tradeBlue: THREE.Color;
  amber: THREE.Color;
  sand: THREE.Color;
  onNavyMuted: THREE.Color;
}

let cached: BrandColors | null = null;

export function getBrandColors(): BrandColors {
  if (cached) return cached;
  cached = {
    navy: new THREE.Color(readVar("--madar-navy", FALLBACK.navy)),
    tradeBlue: new THREE.Color(readVar("--madar-trade-blue", FALLBACK.tradeBlue)),
    amber: new THREE.Color(readVar("--madar-amber", FALLBACK.amber)),
    sand: new THREE.Color(readVar("--madar-sand", FALLBACK.sand)),
    onNavyMuted: new THREE.Color(readVar("--madar-on-navy-muted", FALLBACK.onNavyMuted)),
  };
  return cached;
}
