"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { FROZEN_TIME, stage, type RingConfig, type SceneTheme } from "./config";

const TICK_COUNT = 120;

interface RingProps {
  cfg: RingConfig;
  index: number;
  reduced: boolean;
  theme: SceneTheme;
  glow: THREE.Texture;
}

/** A thin dark-metal orbital ring with an emissive edge, two riders and (optionally) a dial of ticks. */
function Ring({ cfg, index, reduced, theme, glow }: RingProps) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const metal = useRef<THREE.MeshStandardMaterial>(null);
  const ticks = useRef<THREE.InstancedMesh>(null);
  const dark = theme === "dark";

  useLayoutEffect(() => {
    const mesh = ticks.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < TICK_COUNT; i++) {
      const a = (i / TICK_COUNT) * Math.PI * 2;
      const r = cfg.radius + 0.07;
      dummy.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
      dummy.rotation.set(0, 0, a);
      const major = i % 10 === 0;
      dummy.scale.set(major ? 2.2 : 1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [cfg.radius]);

  useFrame((state) => {
    const t = reduced ? FROZEN_TIME : state.clock.elapsedTime;
    const k = stage(t, 0.15 + index * 0.12, 0.9);
    if (tilt.current) tilt.current.scale.setScalar(0.82 + 0.18 * k);
    if (spin.current) spin.current.rotation.z = index * 1.3 + t * cfg.speed;
    if (metal.current) metal.current.opacity = k;
  });

  return (
    <group ref={tilt} rotation={cfg.tilt}>
      <group ref={spin}>
        <mesh>
          <torusGeometry args={[cfg.radius, 0.0075, 10, 256]} />
          <meshStandardMaterial
            ref={metal}
            color={dark ? "#55575f" : "#4a4c54"}
            metalness={1}
            roughness={0.3}
            emissive="#e10600"
            emissiveIntensity={dark ? 0.1 : 0.06}
            transparent
            opacity={0}
          />
        </mesh>
        {[0, Math.PI * 0.92].map((a) => (
          <group key={a} position={[Math.cos(a) * cfg.radius, Math.sin(a) * cfg.radius, 0]}>
            <mesh>
              <sphereGeometry args={[0.024, 16, 16]} />
              <meshBasicMaterial color="#ff5246" toneMapped={false} />
            </mesh>
            <sprite scale={0.16}>
              <spriteMaterial
                map={glow}
                color="#e10600"
                transparent
                opacity={0.55}
                depthWrite={false}
                blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
              />
            </sprite>
          </group>
        ))}
        {cfg.ticks ? (
          <instancedMesh ref={ticks} args={[undefined, undefined, TICK_COUNT]}>
            <boxGeometry args={[0.03, 0.004, 0.004]} />
            <meshBasicMaterial color={dark ? "#6b6e78" : "#7a7d86"} transparent opacity={0.45} />
          </instancedMesh>
        ) : null}
      </group>
    </group>
  );
}

export function Rings({
  rings,
  reduced,
  theme,
  glow,
}: {
  rings: RingConfig[];
  reduced: boolean;
  theme: SceneTheme;
  glow: THREE.Texture;
}) {
  return (
    <>
      {rings.map((cfg, i) => (
        <Ring key={cfg.radius} cfg={cfg} index={i} reduced={reduced} theme={theme} glow={glow} />
      ))}
    </>
  );
}
