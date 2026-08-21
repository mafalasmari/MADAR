"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { getBrandColors } from "./brand-colors";
import type { ScrollProgressRef } from "./use-scroll-progress";
import { localProgress } from "./progress-utils";

interface CoreEngineProps {
  position: [number, number, number];
  progressRef: React.RefObject<ScrollProgressRef>;
  /** [start, end] of overall story progress this stage owns. */
  range: [number, number];
}

const RING_COUNT = 4;

/**
 * Stage 2: the platform's matching/verification intelligence — a rotating
 * core with holographic rings that pulse outward, faster when the visitor
 * scrolls faster (the brief's "pulse dynamically with scroll speed").
 */
export function CoreEngine({ position, progressRef, range }: CoreEngineProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const coreRef = React.useRef<THREE.Mesh>(null);
  const wireRef = React.useRef<THREE.Mesh>(null);
  const ringsRef = React.useRef<THREE.Mesh[]>([]);
  const ringPhaseRef = React.useRef(new Array(RING_COUNT).fill(0).map((_, i) => i / RING_COUNT));

  const brand = React.useMemo(() => getBrandColors(), []);

  useFrame((_state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const progress = progressRef.current.progress;
    const velocity = progressRef.current.velocity;
    const t = localProgress(progress, range[0], range[1]);

    // Only visible/active in and around this stage.
    const visibility = t > 0 && t < 1.15 ? 1 : localProgress(progress, range[0] - 0.06, range[0]);
    group.visible = t > -0.1 && progress < range[1] + 0.22;

    const spin = 0.25 + velocity * 0.9;
    if (coreRef.current) coreRef.current.rotation.y += delta * spin;
    if (wireRef.current) wireRef.current.rotation.y -= delta * spin * 0.6;

    const scaleIn = THREE.MathUtils.smoothstep(t, 0, 0.35);
    group.scale.setScalar(THREE.MathUtils.lerp(0.4, 1, scaleIn) * Math.max(0.001, visibility));

    const pulseSpeed = 0.35 + velocity * 1.1;
    ringsRef.current.forEach((ring, i) => {
      ringPhaseRef.current[i] = (ringPhaseRef.current[i] + delta * pulseSpeed) % 1;
      const cycle = ringPhaseRef.current[i];
      const scale = THREE.MathUtils.lerp(0.6, 3.2, cycle);
      ring.scale.setScalar(scale);
      const mat = ring.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - cycle) * 0.5;
    });
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color={brand.navy}
          emissive={brand.tradeBlue}
          emissiveIntensity={1.4}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshBasicMaterial color={brand.amber} wireframe transparent opacity={0.35} />
      </mesh>
      <pointLight color={brand.tradeBlue} intensity={6} distance={5} />

      {Array.from({ length: RING_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) ringsRef.current[i] = el;
          }}
          rotation={[Math.PI / 2 - 0.4, 0, i * 0.3]}
        >
          <torusGeometry args={[0.9, 0.012, 8, 64]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? brand.tradeBlue : brand.amber}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
