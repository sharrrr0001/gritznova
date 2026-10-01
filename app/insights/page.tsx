import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { CtaBand } from "@/components/sections/cta-band";
import { Badge } from "@/components/ui/badge";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { sortedPosts } from "@/content/insights";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Chevron } from "@/components/layout/logo";

export const metadata = pageMetadata({
  title: "Insights",
  description:
    "Practical writing on software engineering, AI, cloud and DevOps from the GRITZNOVA team.",
  path: "/insights",
});

export default function InsightsPage() {
  const [featured, ...rest] = sortedPosts;

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title={
          <>
            Practical notes on building <span className="text-brand">better software</span>
          </>
        }
        subtitle="Lessons from real projects on AI, cloud, DevOps and product engineering. No fluff."
        breadcrumbs={[{ name: "Insights", path: "/insights" }]}
      />

      <section aria-label="Articles" className="section">
        <div className="container-page flex flex-col gap-5">
          {featured ? (
            <article className="group rounded-card border-border bg-surface hover:border-border-strong relative grid gap-6 border p-7 shadow-sm transition-[border-color,box-shadow] hover:shadow-lg sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="flex flex-col gap-4">
                <div className="text-fg-subtle flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="accent">Latest</Badge>
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>·
                  <span>{featured.readingMinutes} min read</span>
                </div>
                <h2 className="text-h2 max-w-3xl font-semibold">
                  <Link
                    href={`/insights/${featured.slug}`}
                    className="after:absolute after:inset-0"
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="text-lead text-fg-muted max-w-2xl">{featured.description}</p>
              </div>
              <Chevron className="text-fg-subtle group-hover:text-accent-text transition-colors" />
            </article>
          ) : null}

          <RevealGroup className="grid gap-5 md:grid-cols-2">
            {rest.map((post) => (
              <RevealItem key={post.slug} className="h-full">
                <article className="group rounded-card border-border bg-surface hover:border-border-strong relative flex h-full flex-col gap-4 border p-7 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="text-fg-subtle flex flex-wrap items-center gap-2 text-sm">
                    {post.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                  <h2 className="text-h3 font-semibold">
                    <Link href={`/insights/${post.slug}`} className="after:absolute after:inset-0">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-fg-muted">{post.description}</p>
                  <p className="text-fg-subtle mt-auto text-sm">{post.readingMinutes} min read</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
