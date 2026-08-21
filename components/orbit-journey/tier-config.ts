import type { DeviceTier } from "@/lib/device-tier";

export interface TierSettings {
  particleCount: number;
  cargoCount: number;
  bloom: boolean;
  dpr: [number, number];
  shadows: boolean;
}

export const TIER_SETTINGS: Record<Exclude<DeviceTier, "none">, TierSettings> = {
  high: { particleCount: 9000, cargoCount: 18, bloom: true, dpr: [1, 2], shadows: true },
  medium: { particleCount: 4000, cargoCount: 12, bloom: true, dpr: [1, 1.5], shadows: false },
  low: { particleCount: 1200, cargoCount: 6, bloom: false, dpr: [1, 1], shadows: false },
};
