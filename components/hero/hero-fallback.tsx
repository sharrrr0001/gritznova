import { cn } from "@/lib/utils";

/**
 * Static composition of the Digital Engineering Core (SVG + CSS only).
 * Shown instantly while the 3D scene loads, and permanently when WebGL is unavailable.
 * Colours come from design tokens, so it adapts to light and dark mode.
 */

/**
 * Round to 2 decimals. Server (Node) and browser trig functions can differ in the last digits,
 * which would otherwise cause a hydration mismatch on these SVG attributes.
 */
const r2 = (n: number) => Math.round(n * 100) / 100;

// Deterministic "particles" (no Math.random, so server and client render identically).
const DOTS = Array.from({ length: 70 }, (_, i) => {
  const a = i * 2.39996;
  const r = 140 + ((i * 53) % 150);
  return {
    x: r2(300 + Math.cos(a) * r),
    y: r2(300 + Math.sin(a) * r * 0.62),
    r: r2(0.8 + ((i * 7) % 5) * 0.3),
    o: r2(0.15 + ((i * 13) % 10) / 30),
  };
});

// Slits between the machined latitude bands of the core (y offset from centre, partial cut-outs).
const SLITS = [-78, -52, -26, 0, 26, 52, 78].map((y, i) => {
  const r = 112;
  const rx = r2(Math.sqrt(r * r - y * y));
  return { y, rx, ry: r2(rx * 0.2), cut: [0, 0.35, 0, 0.55, 0.2, 0, 0.4][i]! };
});

const NODES = [
  { x: 92, y: 238, label: "AI" },
  { x: 488, y: 196, label: "Cloud" },
  { x: 520, y: 380, label: "Data" },
  { x: 130, y: 418, label: "Security" },
  { x: 318, y: 120, label: "Software" },
];

export function HeroFallback({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none select-none", className)} aria-hidden>
      <svg viewBox="0 0 600 600" className="size-full">
        <defs>
          <radialGradient id="hf-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.32" />
            <stop offset="60%" stopColor="var(--brand)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hf-metal" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#3a3b42" />
            <stop offset="55%" stopColor="#16171b" />
            <stop offset="100%" stopColor="#0b0b0d" />
          </radialGradient>
          <radialGradient id="hf-heart" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#ff5a4d" />
            <stop offset="100%" stopColor="#e10600" stopOpacity="0" />
          </radialGradient>
          <clipPath id="hf-core">
            <circle cx="300" cy="300" r="104" />
          </clipPath>
        </defs>

        <circle cx="300" cy="300" r="270" fill="url(#hf-glow)" />

        {DOTS.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="var(--fg-subtle)" opacity={d.o} />
        ))}

        {/* Orbits */}
        <g fill="none" strokeWidth="1">
          <ellipse
            cx="300"
            cy="300"
            rx="232"
            ry="64"
            transform="rotate(-14 300 300)"
            stroke="var(--border-strong)"
          />
          <ellipse
            cx="300"
            cy="300"
            rx="196"
            ry="96"
            transform="rotate(22 300 300)"
            stroke="var(--border-strong)"
            opacity="0.8"
          />
          <ellipse
            cx="300"
            cy="300"
            rx="160"
            ry="38"
            transform="rotate(-4 300 300)"
            stroke="var(--brand)"
            opacity="0.45"
          />
        </g>

        {/* Data paths */}
        <g fill="none" strokeWidth="0.8" opacity="0.5">
          {NODES.map((n) => (
            <path
              key={n.label}
              d={`M${n.x} ${n.y} Q ${(n.x + 300) / 2} ${(n.y + 300) / 2 - 40} 300 300`}
              stroke="var(--fg-subtle)"
            />
          ))}
        </g>

        {/* Core */}
        <circle cx="300" cy="300" r="112" fill="url(#hf-metal)" />
        <circle cx="300" cy="300" r="46" fill="url(#hf-heart)" opacity="0.55" />
        <g clipPath="url(#hf-core)" fill="none" strokeLinecap="round">
          {SLITS.map((s) => (
            <path
              key={s.y}
              d={`M ${300 - s.rx} ${300 + s.y} A ${s.rx} ${s.ry} 0 0 0 ${300 + s.rx} ${300 + s.y}`}
              pathLength={1}
              strokeDasharray={`${1 - s.cut} 1`}
              stroke="var(--brand)"
              strokeWidth="2.2"
              opacity={0.75 - Math.abs(s.y) / 220}
            />
          ))}
        </g>
        <circle
          cx="300"
          cy="300"
          r="112"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.12"
          strokeWidth="1.2"
        />

        {/* Nodes */}
        {NODES.map((n) => (
          <g key={n.label}>
            <circle cx={n.x} cy={n.y} r="14" fill="var(--brand)" opacity="0.14" />
            <circle
              cx={n.x}
              cy={n.y}
              r="5"
              fill="#1d1e23"
              stroke="var(--brand)"
              strokeWidth="1.2"
            />
            <text
              x={n.x}
              y={n.y - 16}
              textAnchor="middle"
              fill="var(--fg-muted)"
              style={{
                font: "500 10px var(--font-inter)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
