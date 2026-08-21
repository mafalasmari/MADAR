export type DeviceTier = "high" | "medium" | "low" | "none";

/**
 * Cheap, synchronous capability read — no benchmarking, just the signals
 * that reliably predict whether a device can carry bloom + a few thousand
 * particles at 60fps: WebGL availability, reduced-motion preference, core
 * count / memory, and a coarse mobile check.
 *
 * 'none' means "don't mount WebGL at all" — reduced-motion is treated as
 * 'none' too, since a scroll-scrubbed camera flythrough is exactly the kind
 * of motion that preference exists to suppress.
 */
export function getDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "medium";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "none";
  }

  let gl: WebGLRenderingContext | null = null;
  try {
    const canvas = document.createElement("canvas");
    gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  } catch {
    gl = null;
  }
  if (!gl) return "none";

  const nav = window.navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (nav.connection?.saveData) return "low";

  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent);
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;

  if (isMobile || cores <= 4 || memory <= 4) return "low";
  if (cores <= 8 || memory <= 8) return "medium";
  return "high";
}
