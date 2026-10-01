import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * GRITZNOVA mark: red circle, white "G", and the › chevron cut out of the circle
 * (the cut is transparent, so the page background shows through in both themes).
 * To use an official SVG export instead, replace the contents of this component.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("size-8 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <mask id={`gz-cut-${id}`}>
          <rect width="100" height="100" fill="#fff" />
          <polygon points="55,-2 67,50 55,102 63.5,102 75.5,50 63.5,-2" fill="#000" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="50" fill="var(--brand, #E10600)" mask={`url(#gz-cut-${id})`} />
      <path
        d="M49.6 34.6 A20 20 0 1 0 55.5 51 H38.5"
        fill="none"
        stroke="#fff"
        strokeWidth="9"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/** "GRITZ" follows the text colour (white on dark, near-black on light); "NOVA" is always logo red. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display inline-flex items-baseline text-[1.15rem] leading-none font-normal tracking-[0.06em] uppercase",
        className,
      )}
    >
      <span className="sr-only">GRITZNOVA</span>
      <span aria-hidden className="text-fg">
        Gritz
      </span>
      <span aria-hidden className="text-brand inline-flex items-baseline">
        Nov
        {/* The logo's "A" has no crossbar (Λ). Drawn so it matches at any size. */}
        <svg viewBox="0 0 10 12" className="ml-[0.03em] h-[0.72em] w-auto self-baseline">
          <polyline
            points="0.7,12 5,0.9 9.3,12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinejoin="miter"
          />
        </svg>
      </span>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 rounded-md", className)}
      aria-label="GRITZNOVA home"
    >
      <LogoMark />
      <Wordmark />
    </Link>
  );
}

/** The › from the logo, used as the site's arrow/bullet motif. Inherits the current text colour. */
export function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 20"
      aria-hidden
      data-chevron
      className={cn("h-[0.85em] w-auto shrink-0", className)}
    >
      <polygon points="0,0 4.6,0 12,10 4.6,20 0,20 7.4,10" fill="currentColor" />
    </svg>
  );
}
