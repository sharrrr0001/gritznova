import type { MetadataRoute } from "next";
import { posts } from "@/content/insights";
import { services } from "@/content/services";
import { caseStudies } from "@/content/work";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "/",
    "/about",
    "/work",
    "/insights",
    "/careers",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: now,
      priority: 0.9,
    })),
    ...caseStudies.map((c) => ({
      url: absoluteUrl(`/work/${c.slug}`),
      lastModified: now,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/insights/${p.slug}`),
      lastModified: new Date(p.date),
      priority: 0.6,
    })),
  ];
}
