import Image from "next/image";
import { cn } from "@/lib/utils";

interface CoverArtProps {
  /** 0, 1 or 2: picks the chart shape so neighbouring covers differ. */
  variant: number;
  label: string;
  image?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Case-study cover. Uses the real `image` when provided; otherwise renders a generated abstract
 * "interface" composition in brand colours, so the layout looks finished until screenshots exist.
 */
export function CoverArt({ variant, label, image, className, priority }: CoverArtProps) {
  if (image) {
    return (
      <div className={cn("bg-surface-2 relative aspect-[16/10] overflow-hidden", className)}>
        <Image
          src={image}
          alt={label}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 400px, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  const c1 = "var(--brand)";
  const c2 = "var(--fg-subtle)";
  const lines = [
    "164,144 192,128 218,134 246,110 274,116 302,96 328,100",
    "164,120 192,132 218,112 246,118 274,98 302,104 328,90",
    "164,146 192,140 218,122 246,126 274,104 302,100 328,92",
  ];
  const points = lines[Math.abs(variant) % lines.length];

  return (
    <div
      role="img"
      aria-label={`${label} (illustration)`}
      className={cn("bg-surface-2 relative aspect-[16/10] overflow-hidden", className)}
      style={{
        backgroundImage: "radial-gradient(120% 90% at 100% 0%, var(--glow), transparent 60%)",
      }}
    >
      <svg
        viewBox="0 0 400 250"
        className="absolute inset-0 size-full"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <g opacity="0.9">
          <rect
            x="48"
            y="44"
            width="304"
            height="180"
            rx="12"
            className="fill-surface stroke-border-strong"
            strokeWidth="1"
          />
          <rect x="48" y="44" width="304" height="26" rx="12" className="fill-surface-2" />
          <circle cx="64" cy="57" r="3.5" className="fill-border-strong" />
          <circle cx="76" cy="57" r="3.5" className="fill-border-strong" />
          <circle cx="88" cy="57" r="3.5" className="fill-border-strong" />
          <rect x="64" y="86" width="72" height="8" rx="4" className="fill-surface-3" />
          <rect x="64" y="102" width="52" height="8" rx="4" className="fill-surface-3" />
          <rect x="64" y="118" width="62" height="8" rx="4" className="fill-surface-3" />
          <rect x="64" y="134" width="44" height="8" rx="4" className="fill-surface-3" />
          <rect x="156" y="86" width="180" height="70" rx="8" fill={c1} opacity="0.12" />
          <polyline
            points={points}
            fill="none"
            stroke={c1}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="156" y="168" width="84" height="40" rx="8" className="fill-surface-2" />
          <rect x="252" y="168" width="84" height="40" rx="8" className="fill-surface-2" />
          <rect x="166" y="180" width="40" height="6" rx="3" fill={c2} opacity="0.7" />
          <rect x="262" y="180" width="52" height="6" rx="3" fill={c1} opacity="0.7" />
          <rect x="166" y="192" width="56" height="5" rx="2.5" className="fill-surface-3" />
          <rect x="262" y="192" width="36" height="5" rx="2.5" className="fill-surface-3" />
        </g>
      </svg>
    </div>
  );
}
