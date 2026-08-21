import * as THREE from "three";

/** Progress (0..1) where each of the 5 stages begins. */
export const STAGE_STARTS = [0, 0.18, 0.4, 0.62, 0.84] as const;

interface Keyframe {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

// Authored in "story space": the camera flies in -Z as the journey
// progresses. Stage 1 spark sits at the origin; each later stage's set
// dressing is placed further down -Z so the whole thing reads as one
// continuous corridor rather than five disconnected dioramas.
const KEYFRAMES: Keyframe[] = [
  { position: new THREE.Vector3(0, 0.4, 6), target: new THREE.Vector3(0, 0.2, 0) }, // 1. Spark
  { position: new THREE.Vector3(0, 0.7, 1.5), target: new THREE.Vector3(0, 0.3, -3) }, // 2. approach core
  { position: new THREE.Vector3(1.4, 0.2, -4.5), target: new THREE.Vector3(0, 0.2, -6.5) }, // 2b. orbit core
  { position: new THREE.Vector3(3.6, 2.9, -9.2), target: new THREE.Vector3(0, 0.4, -12) }, // 3. isometric node
  { position: new THREE.Vector3(-2.2, 1.1, -18.5), target: new THREE.Vector3(0, 0.3, -20) }, // 4. highway sweep
  { position: new THREE.Vector3(0, 1.2, -26), target: new THREE.Vector3(0, 0.7, -27.2) }, // 5. orbit reveal
];

const POSITION_CURVE = new THREE.CatmullRomCurve3(
  KEYFRAMES.map((k) => k.position),
  false,
  "catmullrom",
  0.5,
);

/** Mirrors a point across the X axis — the whole story flips for RTL. */
function mirrorX(v: THREE.Vector3, mirrored: boolean): THREE.Vector3 {
  return mirrored ? new THREE.Vector3(-v.x, v.y, v.z) : v;
}

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

/** Samples the camera position + look-at target at story progress `t` (0..1). */
export function sampleCameraPath(
  t: number,
  mirrored: boolean,
  outPosition: THREE.Vector3,
  outTarget: THREE.Vector3,
) {
  const clamped = THREE.MathUtils.clamp(t, 0, 1);
  const position = POSITION_CURVE.getPoint(clamped);
  outPosition.copy(mirrorX(position, mirrored));

  // Targets aren't on a spline — segment-wise lerp between the two
  // nearest keyframe targets is smooth enough for a look-at point.
  const scaled = clamped * (KEYFRAMES.length - 1);
  const i = Math.min(Math.floor(scaled), KEYFRAMES.length - 2);
  const localT = scaled - i;
  tmpA.copy(KEYFRAMES[i].target);
  tmpB.copy(KEYFRAMES[i + 1].target);
  const target = tmpA.lerp(tmpB, localT);
  outTarget.copy(mirrorX(target, mirrored));
}

export function stageIndexForProgress(t: number): number {
  for (let i = STAGE_STARTS.length - 1; i >= 0; i--) {
    if (t >= STAGE_STARTS[i]) return i;
  }
  return 0;
}
