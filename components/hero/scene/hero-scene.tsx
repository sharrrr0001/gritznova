"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";
import * as THREE from "three";
import {
  createGlowTexture,
  ECO_NODES,
  MOBILE_NODE_IDS,
  RINGS,
  type SceneInput,
  type SceneTheme,
} from "./config";
import { Core } from "./core";
import { Ecosystem, type FocusState } from "./ecosystem";
import { Particles } from "./particles";
import { Rings } from "./rings";

export interface HeroSceneProps {
  theme: SceneTheme;
  reduced: boolean;
  mobile: boolean;
  /** False while the hero is off-screen: rendering pauses completely. */
  active: boolean;
  input: RefObject<SceneInput>;
  /** Updated with performance.now() on every drawn frame (read by the watchdog). */
  heartbeat: RefObject<number>;
  /** Called once real frames have been drawn, never earlier. */
  onReady: () => void;
  onContextLost: () => void;
}

const CAMERA_BASE = new THREE.Vector3(0, 1.2, 7.7);

/** Reports drawn frames: a heartbeat for the watchdog and a one-time "ready" after real frames. */
function FrameSignal({
  heartbeat,
  onReady,
  reduced,
}: {
  heartbeat: RefObject<number>;
  onReady: () => void;
  reduced: boolean;
}) {
  const frames = useRef(0);
  useFrame(() => {
    heartbeat.current = performance.now();
    frames.current += 1;
    // Reduced motion renders on demand (a single frame), otherwise wait for a few real frames.
    if (frames.current === (reduced ? 1 : 3)) onReady();
  });
  return null;
}

/** Makes sure a frame is drawn whenever rendering resumes or the theme changes. */
function RenderKick({ active, theme }: { active: boolean; theme: SceneTheme }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (active) invalidate();
  }, [active, theme, invalidate]);
  return null;
}

/** Cinematic 3/4 camera with damped cursor parallax and a slow scroll push-in. */
function Rig({
  input,
  reduced,
  mobile,
  children,
}: {
  input: RefObject<SceneInput>;
  reduced: boolean;
  mobile: boolean;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const pointer = input.current ?? { px: 0, py: 0, scroll: 0 };
    const px = reduced || mobile ? 0 : pointer.px;
    const py = reduced || mobile ? 0 : pointer.py;
    const s = reduced ? 0 : pointer.scroll;
    const damp = reduced ? 1 : 1 - Math.pow(0.002, delta);
    const cam = state.camera;
    const baseZ = mobile ? 8.9 : CAMERA_BASE.z;

    cam.position.x += (px * 0.6 - cam.position.x) * damp;
    cam.position.y += (CAMERA_BASE.y + py * 0.35 + s * 0.7 - cam.position.y) * damp;
    cam.position.z += (baseZ - s * 1.8 - cam.position.z) * damp;
    cam.lookAt(0, s * 0.3, 0);

    const g = group.current;
    if (g) {
      // The whole system turns gently toward the cursor.
      g.rotation.y += (px * 0.32 + s * 0.55 - g.rotation.y) * damp;
      g.rotation.x += (0.12 - py * 0.16 - g.rotation.x) * damp;
      g.position.y += (-s * 0.35 - g.position.y) * damp;
    }
  });

  return <group ref={group}>{children}</group>;
}

export default function HeroScene({
  theme,
  reduced,
  mobile,
  active,
  input,
  heartbeat,
  onReady,
  onContextLost,
}: HeroSceneProps) {
  const [dpr, setDpr] = useState(mobile ? 1.5 : 1.75);
  const [glow] = useState(createGlowTexture);
  const focus = useRef<FocusState>({ position: new THREE.Vector3(99, 99, 99), amount: 0 });
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const dark = theme === "dark";

  const nodes = useMemo(
    () => (mobile ? ECO_NODES.filter((n) => MOBILE_NODE_IDS.includes(n.id)) : ECO_NODES),
    [mobile],
  );
  const rings = useMemo(() => (mobile ? RINGS.slice(0, 2) : RINGS), [mobile]);

  return (
    <div className="relative size-full">
      <Canvas
        dpr={[1, dpr]}
        camera={{ position: CAMERA_BASE.toArray(), fov: 34, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={!active ? "never" : reduced ? "demand" : "always"}
        style={{ touchAction: "pan-y" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.domElement.addEventListener("webglcontextlost", onContextLost, { once: true });
        }}
      >
        <FrameSignal heartbeat={heartbeat} onReady={onReady} reduced={reduced} />
        <RenderKick active={active} theme={theme} />
        <PerformanceMonitor onDecline={() => setDpr(1)} />

        <ambientLight intensity={dark ? 0.22 : 0.65} />
        <directionalLight position={[-4, 5, 6]} intensity={dark ? 1.5 : 1.8} />
        {/* Interior glow lights the metal panels from inside */}
        <pointLight position={[0, 0, 0]} color="#ff2a1f" intensity={3.5} distance={2.2} decay={2} />
        {/* Cinematic red rim from behind */}
        <pointLight
          position={[4.5, -1.5, -4]}
          color="#ff2a1f"
          intensity={dark ? 10 : 6}
          distance={14}
          decay={2}
        />

        {/* Procedural studio reflections: rendered once, no HDR download. */}
        <Environment resolution={128} frames={1}>
          <Lightformer
            form="rect"
            intensity={2.4}
            position={[0, 5, 2]}
            rotation-x={Math.PI / 2}
            scale={[10, 3, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.2}
            position={[-5, 1, 3]}
            rotation-y={Math.PI / 2.5}
            scale={[3, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.1}
            color="#ff2a1f"
            position={[5, -0.5, -3]}
            rotation-y={-Math.PI / 2.5}
            scale={[2, 6, 1]}
          />
        </Environment>

        <Particles
          count={mobile ? 900 : 3600}
          reduced={reduced}
          theme={theme}
          input={input}
          focus={focus}
        />

        <Rig input={input} reduced={reduced} mobile={mobile}>
          <Core reduced={reduced} theme={theme} glow={glow} />
          <Rings rings={rings} reduced={reduced} theme={theme} glow={glow} />
          <Ecosystem
            nodes={nodes}
            reduced={reduced}
            theme={theme}
            glow={glow}
            interactive={!mobile}
            focus={focus}
            hovered={hovered}
            onHover={setHovered}
            labels={labels}
          />
        </Rig>
      </Canvas>

      {/* Node labels: plain DOM positioned from the 3D scene every frame (decorative). */}
      <div className="pointer-events-none absolute inset-0">
        {nodes.map((node, i) => (
          <div
            key={node.id}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className="absolute top-0 left-0 flex flex-col items-center gap-0.5 whitespace-nowrap opacity-0 will-change-transform select-none"
          >
            <span
              className={cn(
                "text-[10.5px] font-medium tracking-[0.22em] uppercase transition-colors duration-300",
                hovered === i ? "text-fg" : "text-fg-muted",
              )}
            >
              {node.label}
            </span>
            {!mobile ? (
              <span
                className={cn(
                  "text-fg-muted text-[11px] tracking-[0.02em] transition-[opacity,transform] duration-300",
                  hovered === i ? "translate-y-0 opacity-100" : "-translate-y-0.5 opacity-0",
                )}
              >
                {node.desc}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
