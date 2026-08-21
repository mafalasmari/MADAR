"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

import { getBrandColors } from "./brand-colors";
import { sampleCameraPath } from "./camera-path";
import type { ScrollProgressRef } from "./use-scroll-progress";
import { DataStream } from "./data-stream";
import { CoreEngine } from "./core-engine";
import { LogisticsNode } from "./logistics-node";
import { FleetTransit } from "./fleet-transit";
import { OrbitFinale } from "./orbit-finale";
import type { TierSettings } from "./tier-config";

interface SceneProps {
  progressRef: React.RefObject<ScrollProgressRef>;
  mirrored: boolean;
  settings: TierSettings;
}

function CameraRig({
  progressRef,
  mirrored,
}: {
  progressRef: React.RefObject<ScrollProgressRef>;
  mirrored: boolean;
}) {
  const { camera, pointer } = useThree();
  const smoothed = React.useRef(0);
  const pos = React.useMemo(() => new THREE.Vector3(), []);
  const target = React.useMemo(() => new THREE.Vector3(), []);
  const parallax = React.useMemo(() => new THREE.Vector3(), []);

  useFrame((_state, delta) => {
    // A little extra lag on top of ScrollTrigger's own scrub, so the camera
    // never snaps even on a fast wheel flick.
    const raw = progressRef.current.progress;
    smoothed.current = THREE.MathUtils.damp(smoothed.current, raw, 4, delta);

    sampleCameraPath(smoothed.current, mirrored, pos, target);

    parallax.set(
      THREE.MathUtils.damp(parallax.x, pointer.x * 0.25, 3, delta),
      THREE.MathUtils.damp(parallax.y, pointer.y * 0.12, 3, delta),
      0,
    );

    camera.position.set(pos.x + parallax.x, pos.y + parallax.y, pos.z);
    camera.lookAt(target);
  });

  return null;
}

export function Scene({ progressRef, mirrored, settings }: SceneProps) {
  const brand = React.useMemo(() => getBrandColors(), []);

  return (
    <>
      <color attach="background" args={[brand.navy]} />
      <fog attach="fog" args={[brand.navy, 10, 36]} />

      <ambientLight color={brand.onNavyMuted} intensity={0.5} />
      <hemisphereLight args={[brand.tradeBlue, brand.navy, 0.6]} />
      <directionalLight position={[4, 6, 4]} color={brand.sand} intensity={0.8} />

      <CameraRig progressRef={progressRef} mirrored={mirrored} />

      {/* Stage 1: request spark */}
      <mesh position={[0, 0.2, 0]}>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color={brand.amber}
          emissive={brand.amber}
          emissiveIntensity={1.6}
          metalness={0.3}
          roughness={0.3}
        />
      </mesh>
      <pointLight position={[0, 0.2, 0]} color={brand.amber} intensity={3} distance={3} />

      <DataStream
        count={settings.particleCount}
        progressRef={progressRef}
        zStart={2.4}
        zEnd={-6.3}
        envelope={[0, 0.06, 0.34, 0.44]}
        mirrored={mirrored}
      />

      {/* Stage 2 */}
      <CoreEngine position={[0, 0.2, -6.5]} progressRef={progressRef} range={[0.18, 0.4]} />

      {/* Stage 3 */}
      <LogisticsNode
        position={[0, 0, -12]}
        count={settings.cargoCount}
        progressRef={progressRef}
        range={[0.4, 0.62]}
        mirrored={mirrored}
      />

      {/* Stage 4 */}
      <FleetTransit
        progressRef={progressRef}
        range={[0.62, 0.84]}
        zStart={-13.5}
        zEnd={-24}
        mirrored={mirrored}
      />

      {/* Stage 5 */}
      <OrbitFinale
        position={[0, 0.5, -27]}
        progressRef={progressRef}
        range={[0.84, 1]}
        mirrored={mirrored}
        burstCount={Math.min(600, Math.round(settings.particleCount * 0.08))}
      />

      {settings.bloom && (
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.25}
            luminanceSmoothing={0.35}
            intensity={0.85}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.15} darkness={0.7} />
        </EffectComposer>
      )}
    </>
  );
}
