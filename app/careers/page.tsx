import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { jobs, values } from "@/content/team";
import { pageMetadata } from "@/lib/seo";
import { Chevron } from "@/components/layout/logo";

export const metadata = pageMetadata({
  title: "Careers",
  description:
    "Join GRITZNOVA. Work on meaningful software, AI and cloud projects with a small, senior team.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title={
          <>
            Do the <span className="text-brand">best work</span> of your career
          </>
        }
        subtitle="Small senior teams, real ownership and clients who value craft. We're always keen to meet thoughtful engineers and designers."
        breadcrumbs={[{ name: "Careers", path: "/careers" }]}
      />

      <section aria-labelledby="roles-title" className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <h2 id="roles-title" className="text-h2 font-semibold">
              Open roles
            </h2>
            <ul className="text-fg-muted flex flex-col gap-3">
              {values.map((v) => (
                <li key={v.title}>
                  <span className="text-fg font-medium">{v.title}.</span> {v.body}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            {jobs.length ? (
              jobs.map((job) => (
                <article
                  key={job.slug}
                  className="group rounded-card border-border bg-surface hover:border-border-strong relative flex flex-col gap-3 border p-6 transition-[border-color,box-shadow] hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-h3 font-semibold">
                      <a
                        href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                        className="after:absolute after:inset-0"
                      >
                        {job.title}
                      </a>
                    </h3>
                    <p className="text-fg-muted mt-1 text-sm">{job.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge>
                        <MapPin className="size-3" aria-hidden /> {job.location}
                      </Badge>
                      <Badge>{job.type}</Badge>
                    </div>
                  </div>
                  <Chevron className="text-fg-subtle group-hover:text-accent-text" />
                </article>
              ))
            ) : (
              <p className="rounded-card border-border text-fg-muted border border-dashed p-6">
                No open roles right now, but we&apos;re always happy to hear from great people.
              </p>
            )}
            <div className="rounded-card border-border bg-surface-2 border p-6">
              <p className="font-medium">Don&apos;t see your role?</p>
              <p className="text-fg-muted mt-1 text-sm">
                Send your CV and a note about what you&apos;d love to work on.
              </p>
              <a
                href={`mailto:${site.contact.email}?subject=General%20application`}
                className={`${buttonVariants({ variant: "secondary", size: "sm" })} mt-4`}
              >
                Email us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
