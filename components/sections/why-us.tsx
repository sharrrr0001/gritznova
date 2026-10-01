import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { differentiators } from "@/content/home";
import { Chevron } from "@/components/layout/logo";

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="section border-border bg-surface/40 border-t">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            id="why-title"
            eyebrow="Why GRITZNOVA"
            title="A partner that's accountable for outcomes"
            highlight="outcomes"
            subtitle="We're not the biggest agency. We're the one that picks up the phone, tells you the truth and ships."
          />
          <Link
            href="/about"
            className="text-accent-text inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            How we work <Chevron />
          </Link>
        </div>

        <RevealGroup className="rounded-card border-border bg-border grid gap-px overflow-hidden border sm:grid-cols-2">
          {differentiators.map((d) => {
            const Icon = d.icon;
            return (
              <RevealItem key={d.title} className="bg-surface flex flex-col gap-4 p-7">
                <Icon className="text-fg size-6" aria-hidden strokeWidth={1.75} />
                <h3 className="text-h3 font-semibold">{d.title}</h3>
                <p className="text-fg-muted text-[0.9375rem]">{d.body}</p>
                <p className="border-border text-fg-subtle mt-auto border-t border-dashed pt-4 font-mono text-xs">
                  {d.proof}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
