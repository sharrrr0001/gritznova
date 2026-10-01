import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { caseStudies } from "@/content/work";
import { CaseStudyCard } from "./case-study-card";
import { Chevron } from "@/components/layout/logo";

export function FeaturedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="section">
      <div className="container-page flex flex-col gap-14">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            id="work-title"
            eyebrow="Featured work"
            title="Real problems. Measurable results."
            highlight="Measurable results."
            subtitle="A look at how we've helped teams ship faster, cut costs and automate with AI."
          />
          <Link href="/work" className={buttonVariants({ variant: "secondary" })}>
            All case studies <Chevron />
          </Link>
        </div>

        <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.slice(0, 3).map((study) => (
            <RevealItem key={study.slug} className="h-full">
              <CaseStudyCard study={study} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
