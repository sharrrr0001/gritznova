import { Quote } from "lucide-react";
import Image from "next/image";
import { PlaceholderTag } from "@/components/ui/badge";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { testimonials } from "@/content/testimonials";

function initials(name: string) {
  const clean = name.replace(/[[\]]/g, "");
  return clean
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="section">
      <div className="container-page flex flex-col gap-14">
        <SectionHeader
          id="testimonials-title"
          eyebrow="Testimonials"
          title="What our clients say"
          highlight="clients"
          subtitle="Our best marketing comes from the teams we've worked with."
          align="center"
        />

        <RevealGroup className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <RevealItem key={i} className="h-full">
              <figure className="rounded-card border-border bg-surface flex h-full flex-col gap-6 border p-7 shadow-sm">
                <div className="flex items-center justify-between">
                  <Quote className="text-accent-text size-6" aria-hidden />
                  {t.placeholder ? <PlaceholderTag /> : null}
                </div>
                <blockquote className="text-fg flex-1 text-[1.0625rem] leading-relaxed">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="border-border flex items-center gap-3 border-t pt-5">
                  {t.photo ? (
                    <Image
                      src={t.photo}
                      alt=""
                      width={44}
                      height={44}
                      className="size-11 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="bg-surface-2 text-fg-muted grid size-11 place-items-center rounded-full font-mono text-xs"
                    >
                      {initials(t.name) || "?"}
                    </span>
                  )}
                  <div className="text-sm">
                    <p className="text-fg font-medium">{t.name}</p>
                    <p className="text-fg-muted">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
