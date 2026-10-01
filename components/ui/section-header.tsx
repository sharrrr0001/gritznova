import type { ReactNode } from "react";
import { Chevron } from "@/components/layout/logo";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  /** Part of the title to set in logo red, echoing the GRITZ / NOVA split. Use one key word or short phrase. */
  highlight?: string;
  subtitle?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  id?: string;
}

/** Renders `title` with the first occurrence of `highlight` in logo red. */
export function HighlightedTitle({ title, highlight }: { title: string; highlight?: string }) {
  const i = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || i === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, i)}
      <span className="text-brand">{highlight}</span>
      {title.slice(i + highlight.length)}
    </>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-fg-muted flex items-center gap-2 font-mono text-xs font-medium tracking-[0.16em] uppercase",
        className,
      )}
    >
      <Chevron className="text-brand h-2.5" />
      {children}
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "left",
  as: Heading = "h2",
  className,
  id,
}: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading
        id={id}
        className={cn("text-fg font-semibold", Heading === "h1" ? "text-h1" : "text-h2")}
      >
        <HighlightedTitle title={title} highlight={highlight} />
      </Heading>
      {subtitle ? <p className="text-lead text-fg-muted">{subtitle}</p> : null}
    </Reveal>
  );
}
