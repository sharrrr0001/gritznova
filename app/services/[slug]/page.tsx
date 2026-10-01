import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/layout/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import { TrackedLink } from "@/components/layout/tracked-link";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { CtaBand } from "@/components/sections/cta-band";
import { buttonVariants } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { getService, services } from "@/content/services";
import { bookingHref } from "@/content/site";
import { caseStudies } from "@/content/work";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { Chevron } from "@/components/layout/logo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.title,
    description: service.intro,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const Icon = service.icon;
  const related = caseStudies.filter((c) => c.services.includes(service.slug));
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHeader
        eyebrow={service.title}
        title={service.headline}
        subtitle={service.intro}
        breadcrumbs={[
          { name: "Services", path: "/#services" },
          { name: service.shortTitle, path: `/services/${service.slug}` },
        ]}
      >
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <TrackedLink
            href={bookingHref}
            event={`service_${service.slug}_book`}
            className={buttonVariants({ size: "lg" })}
          >
            Discuss your project <Chevron />
          </TrackedLink>
          <Link href="#outcomes" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            What you get
          </Link>
        </div>
      </PageHeader>

      <section id="outcomes" aria-labelledby="outcomes-title" className="section">
        <div className="container-page flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <span className="border-border bg-accent-soft text-accent-text grid size-12 place-items-center rounded-xl border">
              <Icon className="size-6" aria-hidden />
            </span>
            <h2 id="outcomes-title" className="text-h2 font-semibold">
              Outcomes
            </h2>
          </div>
          <RevealGroup className="grid gap-5 md:grid-cols-3">
            {service.outcomes.map((o) => (
              <RevealItem
                key={o.title}
                className="rounded-card border-border bg-surface border p-7 shadow-sm"
              >
                <h3 className="text-h3 font-semibold">{o.title}</h3>
                <p className="text-fg-muted mt-3">{o.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-label="Details" className="section border-border bg-surface/40 border-y">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div>
            <h2 className="text-h3 font-semibold">What we deliver</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {service.deliverables.map((d) => (
                <li key={d} className="text-fg-muted flex gap-3">
                  <Chevron className="text-brand mt-1 h-3" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-h3 font-semibold">Ideal for</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {service.idealFor.map((d) => (
                <li key={d} className="text-fg-muted flex gap-3">
                  <Chevron className="text-brand mt-1 h-3" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-h3 font-semibold">Typical stack</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {service.stack.map((t) => (
                <li
                  key={t}
                  className="border-border bg-surface rounded-lg border px-3 py-1.5 text-sm font-medium"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length ? (
        <section aria-labelledby="related-title" className="section">
          <div className="container-page flex flex-col gap-10">
            <h2 id="related-title" className="text-h2 font-semibold">
              Related work
            </h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CaseStudyCard key={c.slug} study={c} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="other-title" className="pb-8">
        <div className="container-page">
          <h2
            id="other-title"
            className="text-fg-subtle mb-5 font-mono text-xs tracking-[0.14em] uppercase"
          >
            Other services
          </h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg inline-flex rounded-full border px-4 py-2 text-sm transition-colors"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={`Ready to talk ${service.shortTitle}?`} highlight={service.shortTitle} />
      <JsonLd data={serviceJsonLd(service)} />
    </>
  );
}
