import type { ReactNode } from "react";
import { PageHeader } from "./page-header";

export function LegalPage({
  title,
  path,
  updated,
  children,
}: {
  title: string;
  path: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={title}
        subtitle={`Last updated: ${updated}`}
        breadcrumbs={[{ name: title, path }]}
      />
      <section className="section">
        <div className="container-page">
          <div className="border-warn/50 bg-warn/5 text-fg-muted mx-auto mb-10 max-w-prose rounded-xl border border-dashed p-4 text-sm">
            <strong className="text-fg">Template notice:</strong> this is a starting template, not
            legal advice. Have it reviewed by a qualified lawyer for your jurisdiction before
            launch.
          </div>
          <article className="prose prose-headings:font-semibold mx-auto max-w-prose">
            {children}
          </article>
        </div>
      </section>
    </>
  );
}
