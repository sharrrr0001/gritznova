import * as THREE from "three";

/**
 * Shared configuration for the hero "Digital Engineering Core" scene.
 * Everything is deterministic (seeded) so the composition looks the same on every load.
 */

export type SceneTheme = "dark" | "light";

export interface SceneInput {
  /** Pointer position, normalised to -1..1 across the viewport. */
  px: number;
  py: number;
  /** Hero scroll progress, 0 (top) to 1 (hero scrolled out). */
  scroll: number;
}

export interface EcoNode {
  id: string;
  label: string;
  desc: string;
  /** Orbit radius, inclination (x tilt) and ascending angle (y spin) of the node's orbit. */
  radius: number;
  incl: number;
  asc: number;
  speed: number;
  phase: number;
}

const NODE_DEFS: Pick<EcoNode, "id" | "label" | "desc">[] = [
  { id: "ai", label: "AI", desc: "Intelligent systems & automation" },
  { id: "software", label: "Software", desc: "Products engineered to scale" },
  { id: "cloud", label: "Cloud", desc: "Scalable infrastructure" },
  { id: "data", label: "Data", desc: "Reliable data systems" },
  { id: "security", label: "Security", desc: "Secure by design" },
  { id: "automation", label: "Automation", desc: "Workflows that run themselves" },
  { id: "devops", label: "DevOps", desc: "Continuous delivery & operations" },
];

/** Nodes are spaced evenly around the core (by orbit azimuth) with varied tilt and radius. */
export const ECO_NODES: EcoNode[] = NODE_DEFS.map((n, i) => ({
  ...n,
  radius: [2.2, 2.42, 2.05, 2.36, 2.15, 2.45, 2.28][i]!,
  incl: [0.34, -0.22, 0.48, -0.4, 0.16, 0.3, -0.3][i]!,
  asc: 0.35 + (i / NODE_DEFS.length) * Math.PI * 2,
  speed: 0.05 + (i % 3) * 0.006,
  phase: 0,
}));

/** Simplified composition for small screens. */
export const MOBILE_NODE_IDS = ["ai", "cloud", "data", "security"];

export interface RingConfig {
  radius: number;
  /** Tilt of the ring plane (Euler x, y, z). */
  tilt: [number, number, number];
  speed: number;
  ticks: boolean;
}

export const RINGS: RingConfig[] = [
  { radius: 1.38, tilt: [1.32, 0.18, 0.1], speed: 0.06, ticks: false },
  { radius: 1.68, tilt: [1.66, -0.46, -0.24], speed: -0.04, ticks: false },
  { radius: 1.98, tilt: [1.5, 0.52, 0.3], speed: 0.024, ticks: true },
];

export const COLORS = {
  red: new THREE.Color("#e10600"),
  redHot: new THREE.Color("#ff4a3d"),
  white: new THREE.Color("#ffffff"),
  graphite: new THREE.Color("#1a1b1f"),
};

/** Time used when motion is reduced: a fully-formed, static composition. */
export const FROZEN_TIME = 14;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const easeOutCubic = (v: number) => 1 - Math.pow(1 - v, 3);
/** Intro progress for a stage that starts at `start` seconds and lasts `duration`. */
export const stage = (t: number, start: number, duration: number) =>
  easeOutCubic(clamp01((t - start) / duration));

/** Small seeded PRNG (mulberry32), so particle layouts are pure and repeatable. */
export function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Soft radial sprite used for glows and data packets (no post-processing bloom needed). */
export function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.18, "rgba(255,255,255,0.55)");
    g.addColorStop(0.5, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
