"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { getBrandColors } from "./brand-colors";
import type { ScrollProgressRef } from "./use-scroll-progress";
import { localProgress } from "./progress-utils";

interface DataStreamProps {
  count: number;
  progressRef: React.RefObject<ScrollProgressRef>;
  /** Story-space Z the stream flows from (near camera) to (into the core). */
  zStart: number;
  zEnd: number;
  /** Visible for [fadeInStart, fadeInEnd] .. [fadeOutStart, fadeOutEnd] of overall story progress. */
  envelope: [number, number, number, number];
  mirrored: boolean;
}

/**
 * Stage 1→2: the buyer's request "shatters" into a stream of particles
 * that spiral forward and narrow into the processing core — a vortex, not
 * free-floating dust, so it visibly funnels toward one point.
 */
export function DataStream({
  count,
  progressRef,
  zStart,
  zEnd,
  envelope,
  mirrored,
}: DataStreamProps) {
  const pointsRef = React.useRef<THREE.Points>(null);
  const flowPhaseRef = React.useRef(0);

  const { geometry, material } = React.useMemo(() => {
    const brand = getBrandColors();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seed = new Float32Array(count * 4); // angle, radius, phase, spiralTurns

    const c1 = brand.tradeBlue;
    const c2 = brand.amber;
    const mixed = new THREE.Color();

    for (let i = 0; i < count; i++) {
      seed[i * 4 + 0] = Math.random() * Math.PI * 2;
      seed[i * 4 + 1] = 0.15 + Math.random() * 1.3;
      seed[i * 4 + 2] = Math.random();
      seed[i * 4 + 3] = 0.6 + Math.random() * 1.1;

      mixed.copy(c1).lerp(c2, Math.random() < 0.16 ? 1 : 0);
      colors[i * 3 + 0] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;

      positions[i * 3 + 0] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = zStart;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.userData.seed = seed;

    const mat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat };
  }, [count, zStart]);

  useFrame((_state, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const progress = progressRef.current.progress;
    const velocity = progressRef.current.velocity;

    const [fiStart, fiEnd, foStart, foEnd] = envelope;
    let opacity: number;
    if (progress < fiStart) opacity = 0;
    else if (progress < fiEnd) opacity = localProgress(progress, fiStart, fiEnd);
    else if (progress < foStart) opacity = 1;
    else opacity = 1 - localProgress(progress, foStart, foEnd);
    material.opacity = Math.max(0, Math.min(1, opacity)) * 0.85;

    if (opacity <= 0.001) return;

    flowPhaseRef.current += delta * (0.16 + velocity * 0.5);

    const seed = geometry.userData.seed as Float32Array;
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const dir = mirrored ? -1 : 1;

    for (let i = 0; i < count; i++) {
      const angle0 = seed[i * 4 + 0];
      const baseRadius = seed[i * 4 + 1];
      const phase0 = seed[i * 4 + 2];
      const spiralTurns = seed[i * 4 + 3];

      const t = (phase0 + flowPhaseRef.current * 0.35) % 1;
      const z = THREE.MathUtils.lerp(zStart, zEnd, t);
      const radius = THREE.MathUtils.lerp(baseRadius, baseRadius * 0.08, t);
      const angle = angle0 + t * spiralTurns * Math.PI * 2;

      posAttr.setXYZ(
        i,
        Math.cos(angle) * radius * dir,
        Math.sin(angle) * radius * 0.55,
        z,
      );
    }
    posAttr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
