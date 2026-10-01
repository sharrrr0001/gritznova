import Link from "next/link";
import type { ReactNode } from "react";
import { breadcrumbJsonLd } from "@/lib/seo";
import { Eyebrow } from "@/components/ui/section-header";
import { JsonLd } from "./json-ld";
import { Chevron } from "./logo";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs: { name: string; path: string }[];
  children?: ReactNode;
}

/** Top-of-page header for inner pages, with visible breadcrumbs and BreadcrumbList JSON-LD. */
export function PageHeader({ eyebrow, title, subtitle, breadcrumbs, children }: PageHeaderProps) {
  const trail = [{ name: "Home", path: "/" }, ...breadcrumbs];
  return (
    <section className="border-border relative isolate overflow-hidden border-b pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
      <div className="container-page flex flex-col gap-6">
        <nav aria-label="Breadcrumb">
          <ol className="text-fg-subtle flex flex-wrap items-center gap-1 text-sm">
            {trail.map((item, i) => (
              <li key={item.path} className="flex items-center gap-1">
                {i > 0 ? <Chevron className="text-fg-subtle mx-1 h-2.5" /> : null}
                {i < trail.length - 1 ? (
                  <Link href={item.path} className="hover:text-fg">
                    {item.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-fg-muted">
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-h1 max-w-4xl font-semibold">{title}</h1>
        {subtitle ? <p className="text-lead text-fg-muted max-w-2xl">{subtitle}</p> : null}
        {children}
      </div>
      <JsonLd data={breadcrumbJsonLd(trail)} />
    </section>
  );
}
