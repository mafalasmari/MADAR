"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { getBrandColors } from "./brand-colors";
import type { ScrollProgressRef } from "./use-scroll-progress";
import { localProgress } from "./progress-utils";

interface LogisticsNodeProps {
  position: [number, number, number];
  count: number;
  progressRef: React.RefObject<ScrollProgressRef>;
  range: [number, number];
  mirrored: boolean;
}

const dummy = new THREE.Object3D();

/**
 * Stage 3: the smart warehouse node. Cargo units assemble themselves out
 * of thin air in a staggered wave and settle onto the platform grid below —
 * "holographic cargo units assemble... and alight with fluid precision".
 */
export function LogisticsNode({
  position,
  count,
  progressRef,
  range,
  mirrored,
}: LogisticsNodeProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const meshRef = React.useRef<THREE.InstancedMesh>(null);
  const brand = React.useMemo(() => getBrandColors(), []);

  const grid = React.useMemo(() => {
    const cols = Math.ceil(Math.sqrt(count));
    const dir = mirrored ? -1 : 1;
    return Array.from({ length: count }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const spread = 0.62;
      return {
        target: new THREE.Vector3(
          (col - (cols - 1) / 2) * spread * dir,
          0,
          (row - (cols - 1) / 2) * spread,
        ),
        dropFrom: 2.2 + Math.random() * 1.2,
        delay: (col + row) / (cols * 2) + Math.random() * 0.08,
        scale: 0.16 + Math.random() * 0.08,
        spinSpeed: (Math.random() - 0.5) * 1.4,
      };
    });
  }, [count, mirrored]);

  useFrame((_state, delta) => {
    const group = groupRef.current;
    const mesh = meshRef.current;
    if (!group || !mesh) return;
    const progress = progressRef.current.progress;
    const t = localProgress(progress, range[0], range[1]);
    // Gate the whole node (platform included) — not just the cargo
    // instances — so nothing from this stage is visible before its turn.
    group.visible = progress > range[0] - 0.08 && progress < range[1] + 0.28;
    if (!group.visible) return;

    grid.forEach((item, i) => {
      const local = THREE.MathUtils.clamp((t - item.delay) / (1 - item.delay), 0, 1);
      const eased = THREE.MathUtils.smoothstep(local, 0, 1);
      const y = THREE.MathUtils.lerp(item.dropFrom, 0, eased);
      dummy.position.set(item.target.x, y, item.target.z);
      dummy.rotation.set(0, item.spinSpeed * (1 - eased) * 6 + item.spinSpeed * 0.1, 0);
      const scale = item.scale * THREE.MathUtils.lerp(0.2, 1, eased);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    void delta;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Platform */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.4, 48]} />
        <meshStandardMaterial color={brand.navy} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.095, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.35, 2.4, 48]} />
        <meshBasicMaterial color={brand.amber} transparent opacity={0.7} />
      </mesh>

      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 0.62, 1]} />
        <meshStandardMaterial
          color={brand.sand}
          emissive={brand.tradeBlue}
          emissiveIntensity={0.35}
          metalness={0.2}
          roughness={0.5}
        />
      </instancedMesh>
    </group>
  );
}
