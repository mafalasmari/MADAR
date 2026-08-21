"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { getBrandColors } from "./brand-colors";
import type { ScrollProgressRef } from "./use-scroll-progress";
import { localProgress } from "./progress-utils";

interface OrbitFinaleProps {
  position: [number, number, number];
  progressRef: React.RefObject<ScrollProgressRef>;
  range: [number, number];
  mirrored: boolean;
  burstCount: number;
}

/**
 * Stage 5: the literal Madar "smile" — an arc from a start point to an
 * arrowhead, same proportions as the 2D wordmark's gesture — assembles in
 * 3D as the destination locks in, with a radial burst of light on arrival.
 */
export function OrbitFinale({
  position,
  progressRef,
  range,
  mirrored,
  burstCount,
}: OrbitFinaleProps) {
  const brand = React.useMemo(() => getBrandColors(), []);
  const groupRef = React.useRef<THREE.Group>(null);
  const arcRef = React.useRef<THREE.Mesh>(null);
  const dotRef = React.useRef<THREE.Mesh>(null);
  const arrowRef = React.useRef<THREE.Group>(null);
  const burstRef = React.useRef<THREE.Points>(null);
  const burstStartedAt = React.useRef<number | null>(null);
  const clockRef = React.useRef(0);

  const dir = mirrored ? -1 : 1;

  // Same silhouette as the 2D logo's arc, dipping toward the viewer, scaled
  // into story space. Start = amber dot, end = arrowhead.
  const curve = React.useMemo(() => {
    const start = new THREE.Vector3(-1.3 * dir, -0.35, 0);
    const control = new THREE.Vector3(0, -1.05, 0.15);
    const end = new THREE.Vector3(1.3 * dir, -0.35, 0);
    return new THREE.QuadraticBezierCurve3(start, control, end);
  }, [dir]);

  const arcGeometry = React.useMemo(
    () => new THREE.TubeGeometry(curve, 64, 0.028, 10, false),
    [curve],
  );

  const { burstGeometry, burstMaterial, burstDirs } = React.useMemo(() => {
    const positions = new Float32Array(burstCount * 3);
    const colors = new Float32Array(burstCount * 3);
    const dirs = new Float32Array(burstCount * 3);
    const c1 = brand.tradeBlue;
    const c2 = brand.amber;
    const mixed = new THREE.Color();
    for (let i = 0; i < burstCount; i++) {
      const phi = Math.random() * Math.PI * 2;
      const costheta = Math.random() * 2 - 1;
      const theta = Math.acos(costheta);
      dirs[i * 3 + 0] = Math.sin(theta) * Math.cos(phi);
      dirs[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * 0.6;
      dirs[i * 3 + 2] = Math.cos(theta) * 0.5;
      mixed.copy(c1).lerp(c2, Math.random() < 0.35 ? 1 : 0);
      colors[i * 3 + 0] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return { burstGeometry: geo, burstMaterial: mat, burstDirs: dirs };
  }, [burstCount, brand]);

  useFrame((_state, delta) => {
    clockRef.current += delta;
    const group = groupRef.current;
    if (!group) return;
    const progress = progressRef.current.progress;
    const t = localProgress(progress, range[0], range[1]);
    group.visible = progress > range[0] - 0.05;
    if (!group.visible) return;

    // Arc draws in over the first ~70% of the stage.
    const drawT = THREE.MathUtils.smoothstep(t, 0.05, 0.7);
    if (arcRef.current) {
      const mat = arcRef.current.material as THREE.MeshStandardMaterial;
      arcRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, drawT));
      mat.emissiveIntensity = THREE.MathUtils.lerp(0.4, 2, drawT);
    }
    if (dotRef.current) {
      dotRef.current.scale.setScalar(THREE.MathUtils.lerp(0, 1, THREE.MathUtils.smoothstep(t, 0, 0.15)));
    }
    if (arrowRef.current) {
      arrowRef.current.scale.setScalar(
        THREE.MathUtils.lerp(0, 1, THREE.MathUtils.smoothstep(t, 0.55, 0.75)),
      );
    }

    // Radial burst fires once, near arrival.
    if (t > 0.72 && burstStartedAt.current === null) {
      burstStartedAt.current = clockRef.current;
    }
    if (burstRef.current && burstStartedAt.current !== null) {
      const age = clockRef.current - burstStartedAt.current;
      const life = Math.min(age / 1.4, 1);
      const posAttr = burstGeometry.getAttribute("position") as THREE.BufferAttribute;
      const spread = THREE.MathUtils.lerp(0, 2.4, THREE.MathUtils.smoothstep(life, 0, 0.85));
      for (let i = 0; i < burstCount; i++) {
        posAttr.setXYZ(
          i,
          burstDirs[i * 3 + 0] * spread,
          burstDirs[i * 3 + 1] * spread - 0.35,
          burstDirs[i * 3 + 2] * spread,
        );
      }
      posAttr.needsUpdate = true;
      burstMaterial.opacity = (1 - life) * 0.9;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={arcRef} geometry={arcGeometry}>
        <meshStandardMaterial
          color={brand.tradeBlue}
          emissive={brand.tradeBlue}
          emissiveIntensity={0.4}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      <mesh ref={dotRef} position={[-1.3 * dir, -0.35, 0]}>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshStandardMaterial color={brand.amber} emissive={brand.amber} emissiveIntensity={1.6} />
      </mesh>
      <group ref={arrowRef} position={[1.3 * dir, -0.35, 0]}>
        <mesh rotation={[0, 0, dir > 0 ? -0.5 : Math.PI + 0.5]}>
          <coneGeometry args={[0.08, 0.22, 12]} />
          <meshStandardMaterial
            color={brand.tradeBlue}
            emissive={brand.tradeBlue}
            emissiveIntensity={1.4}
          />
        </mesh>
      </group>

      <points ref={burstRef} geometry={burstGeometry} material={burstMaterial} />
      <pointLight color={brand.amber} intensity={3} distance={4} position={[0, -0.35, 0.3]} />
    </group>
  );
}
