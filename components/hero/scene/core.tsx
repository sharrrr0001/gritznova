"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { FROZEN_TIME, seededRandom, stage, type SceneTheme } from "./config";

/** Latitude bands of the machined shell: thin gaps between bands and partial cut-outs reveal the lit interior. */
const BANDS = (() => {
  const count = 9;
  const start = 0.17;
  const end = Math.PI - 0.17;
  const gap = 0.05;
  const step = (end - start) / count;
  const cuts = [0, 0.95, 0, 1.7, 0.45, 0, 1.25, 0, 0.75];
  const speeds = [0.03, -0.05, 0.02, 0.06, -0.035, 0.025, -0.06, 0.04, -0.022];
  return Array.from({ length: count }, (_, i) => ({
    thetaStart: start + i * step + gap / 2,
    thetaLength: step - gap,
    phiLength: Math.PI * 2 - cuts[i]!,
    offset: i * 0.9,
    speed: speeds[i]!,
  }));
})();
const INNER_PARTICLES = 420;

const fresnelVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fresnelFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.0);
    gl_FragColor = vec4(uColor, f * uStrength);
  }
`;

interface CoreProps {
  reduced: boolean;
  theme: SceneTheme;
  glow: THREE.Texture;
}

/**
 * The GRITZNOVA computational core: a machined shell of rotating brushed-metal bands with gaps,
 * a glass outer layer with a soft rim, and a lit interior (particles, gyroscope rings, hot core).
 */
export function Core({ reduced, theme, glow }: CoreProps) {
  const root = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Group>(null);
  const gyroA = useRef<THREE.Mesh>(null);
  const gyroB = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Points>(null);
  const bands = useRef<(THREE.Mesh | null)[]>([]);
  const fresnel = useRef<THREE.ShaderMaterial>(null);
  const heart = useRef<THREE.SpriteMaterial>(null);

  const dark = theme === "dark";

  const innerPositions = useMemo(() => {
    const rand = seededRandom(11);
    const arr = new Float32Array(INNER_PARTICLES * 3);
    for (let i = 0; i < INNER_PARTICLES; i++) {
      const r = 0.18 + Math.cbrt(rand()) * 0.6;
      const th = rand() * Math.PI * 2;
      const u = rand() * 2 - 1;
      const s = Math.sqrt(1 - u * u);
      arr[i * 3] = Math.cos(th) * s * r;
      arr[i * 3 + 1] = u * r;
      arr[i * 3 + 2] = Math.sin(th) * s * r;
    }
    return arr;
  }, []);

  const fresnelUniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color("#ffd9d6") }, uStrength: { value: 0 } }),
    [],
  );

  useFrame((state) => {
    const t = reduced ? FROZEN_TIME : state.clock.elapsedTime;
    const k = stage(t, 0.45, 0.8);
    if (root.current) root.current.scale.setScalar(0.001 + k * 0.999);
    if (shell.current) shell.current.rotation.set(0.22, 0, -0.12);
    bands.current.forEach((band, i) => {
      if (band) band.rotation.y = BANDS[i]!.offset + t * BANDS[i]!.speed;
    });
    if (gyroA.current) gyroA.current.rotation.set(t * 0.32, t * 0.12, 0);
    if (gyroB.current) gyroB.current.rotation.set(Math.PI / 2, 0, -t * 0.26);
    if (inner.current) inner.current.rotation.y = t * 0.14;
    if (fresnel.current) {
      fresnelUniforms.uStrength.value = (dark ? 0.6 : 0.3) * k;
      fresnelUniforms.uColor.value.set(dark ? "#ffd9d6" : "#e10600");
    }
    if (heart.current) heart.current.opacity = (0.5 + Math.sin(t * 1.3) * 0.06) * k;
  });

  return (
    <group ref={root}>
      {/* Hot interior */}
      <sprite scale={1.9}>
        <spriteMaterial
          ref={heart}
          map={glow}
          color="#e10600"
          transparent
          depthWrite={false}
          blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
          opacity={0}
        />
      </sprite>
      <mesh>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshBasicMaterial color="#ff6a5c" toneMapped={false} />
      </mesh>
      <sprite scale={0.55}>
        <spriteMaterial
          map={glow}
          color="#ffffff"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.9}
        />
      </sprite>

      {/* Data particles swirling inside */}
      <points ref={inner}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[innerPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={glow}
          size={0.045}
          color="#ff8a80"
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Gyroscope components */}
      <mesh ref={gyroA}>
        <torusGeometry args={[0.52, 0.008, 12, 120]} />
        <meshStandardMaterial
          color="#3a3b42"
          metalness={1}
          roughness={0.25}
          emissive="#e10600"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh ref={gyroB}>
        <torusGeometry args={[0.66, 0.006, 12, 140]} />
        <meshStandardMaterial
          color="#3a3b42"
          metalness={1}
          roughness={0.3}
          emissive="#e10600"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Machined shell: independently rotating latitude bands of dark brushed metal */}
      <group ref={shell}>
        {BANDS.map((b, i) => (
          <mesh
            key={b.thetaStart}
            ref={(el) => {
              bands.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.95, 96, 6, 0, b.phiLength, b.thetaStart, b.thetaLength]} />
            <meshStandardMaterial
              color={dark ? "#2c2d33" : "#3a3b42"}
              metalness={0.92}
              roughness={0.36}
              envMapIntensity={1.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Glass outer layer + rim light */}
      <mesh>
        <sphereGeometry args={[1.12, 64, 64]} />
        <meshPhysicalMaterial
          color={dark ? "#0b0c0f" : "#e9e9ec"}
          metalness={0.1}
          roughness={0.08}
          transparent
          opacity={dark ? 0.14 : 0.18}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.4}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={1.135}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          ref={fresnel}
          vertexShader={fresnelVertex}
          fragmentShader={fresnelFragment}
          uniforms={fresnelUniforms}
          transparent
          depthWrite={false}
          blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </mesh>
    </group>
  );
}
