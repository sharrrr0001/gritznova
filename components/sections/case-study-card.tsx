import Link from "next/link";
import { Badge, PlaceholderTag } from "@/components/ui/badge";
import type { CaseStudy } from "@/content/types";
import { CoverArt } from "./cover-art";
import { Chevron } from "@/components/layout/logo";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="group rounded-card border-border bg-surface ease-out-quart hover:border-border-strong relative flex h-full flex-col overflow-hidden border shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CoverArt
        variant={study.coverVariant}
        image={study.image}
        label={study.title}
        className="border-border border-b"
      />

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{study.industry}</Badge>
          {study.placeholder ? <PlaceholderTag /> : null}
        </div>

        <h3 className="text-h3 font-semibold">
          <Link href={`/work/${study.slug}`} className="after:absolute after:inset-0">
            {study.title}
          </Link>
        </h3>

        <dl className="flex flex-col gap-3 text-sm">
          <div>
            <dt className="text-fg-subtle font-mono text-[0.6875rem] tracking-wider uppercase">
              Problem
            </dt>
            <dd className="text-fg-muted mt-1">{study.problem}</dd>
          </div>
          <div>
            <dt className="text-fg-subtle font-mono text-[0.6875rem] tracking-wider uppercase">
              Solution
            </dt>
            <dd className="text-fg-muted mt-1">{study.solution}</dd>
          </div>
        </dl>

        <div className="border-border mt-auto flex items-end justify-between gap-4 border-t pt-5">
          <div>
            <p className="text-fg text-3xl font-semibold tracking-tight">{study.result.metric}</p>
            <p className="text-fg-muted text-sm">{study.result.label}</p>
          </div>
          <span className="border-border text-fg-muted group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg grid size-10 shrink-0 place-items-center rounded-full border transition-colors">
            <Chevron />
          </span>
        </div>

        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies used">
          {study.tech.map((t) => (
            <li key={t}>
              <Badge variant="outline">{t}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
