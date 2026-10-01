import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { CoverArt } from "@/components/sections/cover-art";
import { CtaBand } from "@/components/sections/cta-band";
import { Badge, PlaceholderTag } from "@/components/ui/badge";
import { getService } from "@/content/services";
import { caseStudies, getCaseStudy } from "@/content/work";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return pageMetadata({
    title: study.title,
    description: study.summary,
    path: `/work/${slug}`,
    type: "article",
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const facts = [
    { label: "Client", value: study.client },
    { label: "Industry", value: study.industry },
    { label: "Year", value: study.year },
    {
      label: "Services",
      value: study.services
        .map((s) => getService(s)?.shortTitle)
        .filter(Boolean)
        .join(", "),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={`Case study · ${study.industry}`}
        title={study.title}
        subtitle={study.summary}
        breadcrumbs={[
          { name: "Work", path: "/work" },
          { name: study.industry, path: `/work/${study.slug}` },
        ]}
      >
        {study.placeholder ? (
          <div>
            <PlaceholderTag />
          </div>
        ) : null}
      </PageHeader>

      <section className="section" aria-label="Case study">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          <div className="flex min-w-0 flex-col gap-12">
            <CoverArt
              variant={study.coverVariant}
              image={study.image}
              label={study.title}
              priority
              className="rounded-card border-border border"
            />

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { k: "Problem", v: study.problem },
                { k: "Solution", v: study.solution },
                { k: "Result", v: `${study.result.metric} ${study.result.label}` },
              ].map((item) => (
                <div key={item.k} className="rounded-card border-border bg-surface border p-5">
                  <p className="text-accent-text font-mono text-[0.6875rem] tracking-wider uppercase">
                    {item.k}
                  </p>
                  <p className="text-fg-muted mt-2 text-sm">{item.v}</p>
                </div>
              ))}
            </div>

            <article className="prose prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-fg-muted max-w-prose">
              {study.body.map((section) => (
                <div key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ))}
            </article>

            <Link
              href="/work"
              className="text-accent-text inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden /> All case studies
            </Link>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border-border bg-surface border p-6">
              <p className="text-4xl font-semibold tracking-tight">{study.result.metric}</p>
              <p className="text-fg-muted mt-1">{study.result.label}</p>
            </div>
            <dl className="divide-border rounded-card border-border bg-surface divide-y border">
              {facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-4 px-5 py-3.5 text-sm">
                  <dt className="text-fg-subtle">{f.label}</dt>
                  <dd className="text-fg text-right font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className="text-fg-subtle mb-3 font-mono text-xs tracking-[0.14em] uppercase">
                Tech
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {study.tech.map((t) => (
                  <li key={t}>
                    <Badge variant="outline">{t}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <CtaBand title="Facing a similar challenge?" highlight="similar challenge" />
    </>
  );
}
