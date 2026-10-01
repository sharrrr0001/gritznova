import Image from "next/image";
import { PageHeader } from "@/components/layout/page-header";
import { LinkedinIcon } from "@/components/layout/social-icons";
import { CtaBand } from "@/components/sections/cta-band";
import { Process } from "@/components/sections/process";
import { PlaceholderTag } from "@/components/ui/badge";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { story, team, values } from "@/content/team";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About us",
  description: "Our story, mission, values and the senior team behind GRITZNOVA.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            Engineers who care about your <span className="text-brand">outcome</span>
          </>
        }
        subtitle={story.intro}
        breadcrumbs={[{ name: "About", path: "/about" }]}
      />

      <section aria-labelledby="story-title" className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeader
            id="story-title"
            eyebrow="Our story"
            title="Why we exist"
            highlight="exist"
          />
          <div className="text-lead text-fg-muted flex max-w-prose flex-col gap-5">
            {story.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="rounded-card border-border bg-surface mt-4 border p-6">
              <p className="text-accent-text font-mono text-xs tracking-[0.14em] uppercase">
                Mission
              </p>
              <p className="text-fg mt-2 text-lg font-medium">{story.mission}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="values-title"
        className="section border-border bg-surface/40 border-y"
      >
        <div className="container-page flex flex-col gap-12">
          <SectionHeader
            id="values-title"
            eyebrow="Values"
            title="How we work"
            highlight="work"
            align="center"
          />
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <RevealItem
                key={v.title}
                className="rounded-card border-border bg-surface border p-6"
              >
                <span className="text-accent-text font-mono text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-h3 mt-4 font-semibold">{v.title}</h3>
                <p className="text-fg-muted mt-2 text-[0.9375rem]">{v.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="team-title" className="section">
        <div className="container-page flex flex-col gap-12">
          <SectionHeader
            id="team-title"
            eyebrow="Team"
            title="The people behind the work"
            highlight="people"
            subtitle="A small, senior team. The people you meet are the people who build."
          />
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <RevealItem key={`${member.role}-${i}`} className="flex flex-col gap-4">
                <div className="rounded-card border-border bg-surface-2 relative aspect-[4/5] overflow-hidden border">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={`${member.name}, ${member.role}`}
                      fill
                      sizes="(min-width: 1024px) 280px, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-grid absolute inset-0 grid place-items-center [mask-image:none]">
                      <span className="placeholder-chip rounded-lg px-3 py-2 text-xs">[PHOTO]</span>
                    </div>
                  )}
                  {member.placeholder ? (
                    <PlaceholderTag className="bg-surface absolute top-3 left-3" />
                  ) : null}
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-fg font-semibold">{member.name}</h3>
                    <p className="text-fg-muted text-sm">{member.role}</p>
                    <p className="text-fg-subtle mt-1 text-sm">{member.bio}</p>
                  </div>
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      className="text-fg-subtle hover:text-fg"
                    >
                      <LinkedinIcon />
                    </a>
                  ) : null}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Process />
      <CtaBand />
    </>
  );
}
