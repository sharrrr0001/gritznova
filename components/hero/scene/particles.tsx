"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { FROZEN_TIME, seededRandom, stage, type SceneInput, type SceneTheme } from "./config";
import type { FocusState } from "./ecosystem";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMotion;
  uniform float uIntro;
  uniform float uPixelRatio;
  uniform vec3 uMouse;
  uniform vec3 uFocus;
  uniform float uFocusAmount;
  attribute float aSeed;
  attribute float aStream;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    float t = uTime * uMotion;
    vec3 p = position;
    vAccent = 0.0;

    // Slow, layered drift.
    p += vec3(
      sin(t * 0.07 + aSeed * 6.2831),
      cos(t * 0.05 + aSeed * 12.566),
      sin(t * 0.06 + aSeed * 3.1415)
    ) * 0.14;

    float streamFade = 1.0;
    if (aStream > 0.5) {
      // Data travelling into the core, accelerating as it arrives.
      float progress = fract(t * (0.035 + aSeed * 0.05) + aSeed * 7.0);
      p = mix(position, normalize(position) * 1.1, progress * progress);
      streamFade = sin(progress * 3.1415);
      vAccent = 1.0;
    }

    vec4 world = modelMatrix * vec4(p, 1.0);

    // Gentle push away from the cursor.
    vec2 away = world.xy - uMouse.xy;
    float dm = length(away);
    world.xy += normalize(away + 1e-4) * smoothstep(1.3, 0.0, dm) * 0.22;

    // Particles near a hovered node lean towards it and brighten.
    float df = distance(world.xyz, uFocus);
    float focus = smoothstep(1.1, 0.0, df) * uFocusAmount;
    world.xyz = mix(world.xyz, uFocus, focus * 0.12);

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;

    float size = mix(0.8, 2.3, fract(aSeed * 7.13)) + focus * 1.5 + aStream * 0.6;
    gl_PointSize = size * uPixelRatio * (8.5 / -mv.z);

    float depth = smoothstep(19.0, 5.0, -mv.z);
    vAlpha = depth * (0.32 + 0.6 * fract(aSeed * 3.71)) * uIntro * streamFade + focus * 0.6;
    vAccent = max(vAccent, focus);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vAlpha;
  varying float vAccent;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(uColor, uAccent, vAccent), a * vAlpha);
  }
`;

interface ParticlesProps {
  count: number;
  reduced: boolean;
  theme: SceneTheme;
  input: RefObject<SceneInput>;
  focus: RefObject<FocusState>;
}

/**
 * Thousands of tiny particles in a flattened shell around the core, denser close in.
 * Rendered as a single draw call with all motion on the GPU.
 */
export function Particles({ count, reduced, theme, input, focus }: ParticlesProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const dark = theme === "dark";

  const geometry = useMemo(() => {
    const rand = seededRandom(42);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const streams = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const th = rand() * Math.PI * 2;
      const u = rand() * 2 - 1;
      const s = Math.sqrt(1 - u * u);
      const r = 1.4 + Math.pow(rand(), 1.7) * 6.8;
      positions[i * 3] = Math.cos(th) * s * r;
      positions[i * 3 + 1] = u * r * 0.55;
      positions[i * 3 + 2] = Math.sin(th) * s * r - 0.5;
      seeds[i] = rand();
      streams[i] = rand() < 0.07 ? 1 : 0;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aStream", new THREE.BufferAttribute(streams, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMotion: { value: 1 },
      uIntro: { value: 0 },
      uPixelRatio: { value: 1 },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uFocus: { value: new THREE.Vector3(99, 99, 99) },
      uFocusAmount: { value: 0 },
      uColor: { value: new THREE.Color() },
      uAccent: { value: new THREE.Color("#ff2a1f") },
    }),
    [],
  );

  useFrame((state) => {
    const t = reduced ? FROZEN_TIME : state.clock.elapsedTime;
    const u = uniforms;
    u.uTime.value = t;
    u.uMotion.value = reduced ? 0 : 1;
    u.uIntro.value = stage(t, 0, 0.7);
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uColor.value.set(dark ? "#c9ccd4" : "#3b3d45");
    const pointer = input.current;
    if (pointer && !reduced) u.uMouse.value.set(pointer.px * 3.2, pointer.py * 2.4 + 0.3, 0);
    const f = focus.current;
    if (f) {
      u.uFocus.value.copy(f.position);
      u.uFocusAmount.value = f.amount;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}
