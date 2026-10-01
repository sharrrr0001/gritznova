"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { FROZEN_TIME, stage, type EcoNode, type SceneTheme } from "./config";

const PATH_POINTS = 40;
const PACKETS_PER_NODE = 3;
const CORE_SURFACE = 1.1;

/** Where the hovered node is, so the background particles can react to it. */
export interface FocusState {
  position: THREE.Vector3;
  amount: number;
}

// Scratch objects reused every frame (no per-frame allocations).
const _local = new THREE.Vector3();
const _end = new THREE.Vector3();
const _ctrl = new THREE.Vector3();
const _world = new THREE.Vector3();
const _toNode = new THREE.Vector3();
const _toCore = new THREE.Vector3();
const _origin = new THREE.Vector3();
const _curve = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(),
  new THREE.Vector3(),
  new THREE.Vector3(),
);
const _p = new THREE.Vector3();
const _screen = new THREE.Vector3();

interface EcosystemProps {
  nodes: EcoNode[];
  reduced: boolean;
  theme: SceneTheme;
  glow: THREE.Texture;
  interactive: boolean;
  focus: RefObject<FocusState>;
  hovered: number | null;
  onHover: (index: number | null) => void;
  /** DOM label elements (rendered outside the canvas), positioned here every frame. */
  labels: RefObject<(HTMLDivElement | null)[]>;
}

/**
 * Orbiting ecosystem nodes (AI, Cloud, Data…) connected to the core by thin energy paths.
 * Packets travel inward (data → core) and outward (core → outcome), never as a flowchart.
 */
export function Ecosystem({
  nodes,
  reduced,
  theme,
  glow,
  interactive,
  focus,
  hovered,
  onHover,
  labels,
}: EcosystemProps) {
  const dark = theme === "dark";
  const groups = useRef<(THREE.Group | null)[]>([]);
  const glows = useRef<(THREE.SpriteMaterial | null)[]>([]);
  const hoverAmount = useRef(0);

  const orbits = useMemo(
    () =>
      nodes.map((n) =>
        new THREE.Quaternion().setFromEuler(new THREE.Euler(n.incl, n.asc, 0, "YXZ")),
      ),
    [nodes],
  );

  // One thin line per node. Vertex colours fade from neutral at the node to red at the core.
  const lines = useMemo(() => {
    const nodeEnd = new THREE.Color(dark ? "#d7d9de" : "#4a4c54");
    const coreEnd = new THREE.Color("#ff2a1f");
    return nodes.map(() => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(PATH_POINTS * 3), 3),
      );
      const colors = new Float32Array(PATH_POINTS * 3);
      const c = new THREE.Color();
      for (let i = 0; i < PATH_POINTS; i++) {
        c.copy(nodeEnd).lerp(coreEnd, i / (PATH_POINTS - 1));
        colors.set([c.r, c.g, c.b], i * 3);
      }
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: dark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });
      return new THREE.Line(geometry, material);
    });
  }, [nodes, dark]);

  const packetGeometry = useMemo(() => {
    const count = nodes.length * PACKETS_PER_NODE;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, [nodes]);

  useFrame((state, delta) => {
    const t = reduced ? FROZEN_TIME : state.clock.elapsedTime;
    const streams = stage(t, 1.2, 0.6);
    const camera = state.camera;
    const posAttr = packetGeometry.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = packetGeometry.getAttribute("color") as THREE.BufferAttribute;

    hoverAmount.current +=
      ((hovered === null ? 0 : 1) - hoverAmount.current) * Math.min(1, delta * 6);

    nodes.forEach((node, i) => {
      const appear = stage(t, 0.8 + i * 0.09, 0.45);
      const angle = node.phase + t * node.speed;
      _local
        .set(Math.cos(angle) * node.radius, 0, Math.sin(angle) * node.radius)
        .applyQuaternion(orbits[i]!);

      const group = groups.current[i];
      if (group) {
        group.position.copy(_local);
        group.scale.setScalar(0.001 + appear * 0.999);
      }

      // Thin bezier path from the node to the core surface.
      _end.copy(_local).normalize().multiplyScalar(CORE_SURFACE);
      _ctrl.copy(_local).add(_end).multiplyScalar(0.5);
      _ctrl.multiplyScalar(1.18).add(_p.set(0, 0.28, 0));
      _curve.v0.copy(_local);
      _curve.v1.copy(_ctrl);
      _curve.v2.copy(_end);
      const line = lines[i]!;
      const linePos = line.geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let j = 0; j < PATH_POINTS; j++) {
        _curve.getPoint(j / (PATH_POINTS - 1), _p);
        linePos.setXYZ(j, _p.x, _p.y, _p.z);
      }
      linePos.needsUpdate = true;
      const isHovered = hovered === i;
      const material = line.material as THREE.LineBasicMaterial;
      material.opacity = streams * (isHovered ? 0.7 : dark ? 0.16 : 0.22);

      // Data packets: two flowing inward, one flowing outward.
      for (let k = 0; k < PACKETS_PER_NODE; k++) {
        const idx = i * PACKETS_PER_NODE + k;
        const inward = k < 2;
        const speed = 0.16 + (i % 3) * 0.03;
        const raw = (t * speed + i * 0.17 + k * 0.37) % 1;
        const progress = inward ? raw : 1 - raw;
        _curve.getPoint(progress, _p);
        posAttr.setXYZ(idx, _p.x, _p.y, _p.z);
        const fade = Math.sin(raw * Math.PI) * streams * appear;
        const bright = isHovered ? 1.4 : 0.75;
        const v = fade * bright;
        if (inward) colAttr.setXYZ(idx, v, v * 0.32, v * 0.28);
        else colAttr.setXYZ(idx, v * 0.95, v * 0.95, v * 0.95);
      }

      // Labels and glow dim when the node passes behind the core.
      if (group) {
        group.getWorldPosition(_world);
        _origin.set(0, 0, 0);
        group.parent?.localToWorld(_origin);
        _toNode.copy(_world).sub(camera.position);
        _toCore.copy(_origin).sub(camera.position);
        const coreDist = _toCore.length();
        _toCore.normalize();
        const along = _toNode.dot(_toCore);
        const perp = _toNode.addScaledVector(_toCore, -along).length();
        const behind = along > coreDist && perp < 1.15;
        const visibility = behind ? 0.18 : 1;
        const label = labels.current?.[i];
        if (label) {
          _screen.copy(_world).project(camera);
          const x = (_screen.x * 0.5 + 0.5) * state.size.width;
          const y = (-_screen.y * 0.5 + 0.5) * state.size.height;
          label.style.transform = `translate3d(${x.toFixed(1)}px, ${(y - 14).toFixed(1)}px, 0) translate(-50%, -100%)`;
          label.style.opacity = String(appear * visibility * (isHovered ? 1 : 0.62));
        }
        const g = glows.current[i];
        if (g) g.opacity = appear * visibility * (isHovered ? 1 : 0.6);
        if (isHovered && focus.current) focus.current.position.copy(_world);
      }
    });

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    if (focus.current) focus.current.amount = hoverAmount.current;
  });

  const onOver = (i: number) => (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    onHover(i);
  };
  const onOut = () => onHover(null);

  return (
    <group>
      {lines.map((line, i) => (
        <primitive key={nodes[i]!.id} object={line} />
      ))}

      <points geometry={packetGeometry}>
        <pointsMaterial
          map={glow}
          size={0.12}
          vertexColors
          transparent
          depthWrite={false}
          blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
          sizeAttenuation
        />
      </points>

      {nodes.map((node, i) => (
        <group
          key={node.id}
          ref={(el) => {
            groups.current[i] = el;
          }}
        >
          {/* Metallic / glass node */}
          <mesh>
            <sphereGeometry args={[0.075, 32, 32]} />
            <meshPhysicalMaterial
              color={dark ? "#1d1e23" : "#2c2d33"}
              metalness={0.9}
              roughness={0.18}
              clearcoat={1}
              emissive="#e10600"
              emissiveIntensity={hovered === i ? 0.9 : 0.25}
            />
          </mesh>
          <sprite scale={hovered === i ? 0.75 : 0.45}>
            <spriteMaterial
              ref={(el) => {
                glows.current[i] = el;
              }}
              map={glow}
              color="#e10600"
              transparent
              opacity={0}
              depthWrite={false}
              blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
            />
          </sprite>
          {/* Larger invisible hit area for comfortable hovering */}
          <mesh onPointerOver={onOver(i)} onPointerOut={onOut}>
            <sphereGeometry args={[0.26, 12, 12]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
