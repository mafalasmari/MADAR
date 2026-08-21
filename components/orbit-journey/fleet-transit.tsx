"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { getBrandColors } from "./brand-colors";
import type { ScrollProgressRef } from "./use-scroll-progress";
import { localProgress } from "./progress-utils";

interface FleetTransitProps {
  progressRef: React.RefObject<ScrollProgressRef>;
  range: [number, number];
  zStart: number;
  zEnd: number;
  mirrored: boolean;
}

const TRAIL_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const TRAIL_FRAGMENT = `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uProgress;
  void main() {
    if (vUv.x > uProgress) discard;
    float head = smoothstep(uProgress - 0.05, uProgress, vUv.x);
    float body = smoothstep(uProgress - 0.55, uProgress, vUv.x) * 0.35;
    float intensity = 0.25 + body + head * 1.5;
    gl_FragColor = vec4(uColor * intensity, 1.0);
  }
`;

/**
 * Stage 4: a branded vehicle glides along a highway curve, its trail
 * revealed only up to the vehicle's current position along the tube (the
 * tube's own U coordinate doubles as the reveal mask — no per-frame
 * geometry rebuilding needed).
 */
export function FleetTransit({ progressRef, range, zStart, zEnd, mirrored }: FleetTransitProps) {
  const brand = React.useMemo(() => getBrandColors(), []);
  const groupRef = React.useRef<THREE.Group>(null);
  const vehicleRef = React.useRef<THREE.Group>(null);
  const headlightRef = React.useRef<THREE.PointLight>(null);
  const trailMatRef = React.useRef<THREE.ShaderMaterial>(null);

  const { curve, tubeGeometry } = React.useMemo(() => {
    const dir = mirrored ? -1 : 1;
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.4 * dir, 0, zStart),
      new THREE.Vector3(-1.1 * dir, 0.15, (zStart + zEnd) * 0.66),
      new THREE.Vector3(0.9 * dir, -0.05, (zStart + zEnd) * 0.4),
      new THREE.Vector3(-0.3 * dir, 0.1, zEnd),
    ]);
    const geo = new THREE.TubeGeometry(c, 120, 0.03, 8, false);
    return { curve: c, tubeGeometry: geo };
  }, [zStart, zEnd, mirrored]);

  const trailUniforms = React.useMemo(
    () => ({ uColor: { value: brand.tradeBlue }, uProgress: { value: 0 } }),
    [brand],
  );

  const tmpPos = React.useMemo(() => new THREE.Vector3(), []);
  const tmpLook = React.useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const progress = progressRef.current.progress;
    const t = localProgress(progress, range[0], range[1]);
    const active = progress > range[0] - 0.06 && progress < range[1] + 0.1;
    group.visible = active;
    if (!active) return;

    const eased = THREE.MathUtils.smoothstep(t, 0, 1);
    if (trailMatRef.current) trailMatRef.current.uniforms.uProgress.value = eased;

    curve.getPointAt(Math.min(eased, 0.999), tmpPos);
    if (vehicleRef.current) {
      vehicleRef.current.position.copy(tmpPos);
      curve.getTangentAt(Math.min(eased, 0.999), tmpLook);
      tmpLook.add(tmpPos);
      vehicleRef.current.lookAt(tmpLook);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dim base highway */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial color={brand.navy} transparent opacity={0.25} />
      </mesh>
      {/* Progressive light trail */}
      <mesh geometry={tubeGeometry}>
        <shaderMaterial
          ref={trailMatRef}
          uniforms={trailUniforms}
          vertexShader={TRAIL_VERTEX}
          fragmentShader={TRAIL_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <group ref={vehicleRef}>
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.12, 0.55]} />
          <meshStandardMaterial color={brand.navy} metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.3, 0.03, 0.14]} />
          <meshBasicMaterial color={brand.amber} toneMapped={false} />
        </mesh>
        <pointLight ref={headlightRef} color={brand.tradeBlue} intensity={4} distance={2.2} />
      </group>
    </group>
  );
}
