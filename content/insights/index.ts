/**
 * Insights (blog) registry. To add a post:
 *   1. Create content/insights/<slug>.mdx
 *   2. Add an entry below with the same slug.
 */
export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  readingMinutes: number;
  tags: string[];
  author: string;
}

export const posts: PostMeta[] = [
  {
    slug: "shipping-ai-features-that-hold-up",
    title: "Shipping AI features that hold up in production",
    description:
      "Most AI demos never survive contact with real users. Here's the checklist we use to take an LLM feature from prototype to production.",
    date: "2026-09-15",
    readingMinutes: 6,
    tags: ["AI", "Engineering"],
    author: "GRITZNOVA Engineering",
  },
  {
    slug: "five-ways-to-cut-your-cloud-bill",
    title: "Five ways to cut your cloud bill without slowing down",
    description:
      "Cloud costs creep up quietly. These five changes usually deliver the biggest savings with the least risk.",
    date: "2026-08-28",
    readingMinutes: 5,
    tags: ["Cloud", "FinOps"],
    author: "GRITZNOVA Engineering",
  },
  {
    slug: "build-vs-buy-a-practical-framework",
    title: "Build vs. buy: a practical framework for leaders",
    description:
      "Should you build custom software or buy a SaaS product? Use these five questions to make the call with confidence.",
    date: "2026-08-04",
    readingMinutes: 4,
    tags: ["Strategy"],
    author: "GRITZNOVA Engineering",
  },
];

export const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
