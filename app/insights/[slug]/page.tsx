import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/layout/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import { CtaBand } from "@/components/sections/cta-band";
import { getPost, posts } from "@/content/insights";
import { articleJsonLd, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/insights/${slug}`,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Content } = await import(`@/content/insights/${slug}.mdx`);

  return (
    <>
      <PageHeader
        eyebrow={post.tags.join(" · ")}
        title={post.title}
        subtitle={post.description}
        breadcrumbs={[
          { name: "Insights", path: "/insights" },
          { name: post.title, path: `/insights/${post.slug}` },
        ]}
      >
        <p className="text-fg-subtle text-sm">
          {post.author} · <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
          {post.readingMinutes} min read
        </p>
      </PageHeader>

      <section className="section" aria-label="Article">
        <div className="container-page">
          <article className="prose prose-headings:font-semibold prose-headings:tracking-tight prose-a:font-medium mx-auto max-w-prose">
            <Content />
          </article>
          <div className="mx-auto mt-12 max-w-prose">
            <Link
              href="/insights"
              className="text-accent-text inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden /> All insights
            </Link>
          </div>
        </div>
      </section>
      <CtaBand />
      <JsonLd data={articleJsonLd(post)} />
    </>
  );
}
