import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { services } from "@/content/services";
import { Chevron } from "@/components/layout/logo";

export function ServicesGrid() {
  return (
    <section id="services" aria-labelledby="services-title" className="section">
      <div className="container-page flex flex-col gap-14">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            id="services-title"
            eyebrow="Services"
            title="Everything you need to build, scale and modernise"
            highlight="scale"
            subtitle="Six practices, one senior team. Start with a single service or bring us in end to end."
          />
          <Link
            href="/#contact"
            className="text-accent-text inline-flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
          >
            Not sure where to start? Ask us <Chevron />
          </Link>
        </div>

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <RevealItem key={service.slug} className="h-full">
                <article className="group rounded-card border-border bg-surface ease-out-quart hover:border-border-strong relative flex h-full flex-col gap-5 border p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7">
                  <span className="border-border bg-surface-2 text-fg group-hover:border-accent/40 group-hover:bg-accent-soft group-hover:text-accent-text grid size-11 place-items-center rounded-xl border transition-colors">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-h3 text-fg font-semibold">{service.title}</h3>
                    <p className="text-fg-muted text-[0.9375rem]">{service.value}</p>
                  </div>
                  <ul className="text-fg-muted flex flex-col gap-2 text-sm">
                    {service.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2">
                        <Chevron className="text-brand mt-0.5 h-3" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-fg after:rounded-card group-hover:text-accent-text mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium after:absolute after:inset-0"
                  >
                    Learn more<span className="sr-only"> about {service.title}</span>
                    <Chevron className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
