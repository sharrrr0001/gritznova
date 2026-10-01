import { PageHeader } from "@/components/layout/page-header";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { CtaBand } from "@/components/sections/cta-band";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { caseStudies } from "@/content/work";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Work & case studies",
  description:
    "How GRITZNOVA helps teams ship faster, cut cloud costs and automate with AI. Selected case studies.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title={
          <>
            Case <span className="text-brand">studies</span>
          </>
        }
        subtitle="Every engagement starts with a business problem and ends with a measurable result. Here's a selection."
        breadcrumbs={[{ name: "Work", path: "/work" }]}
      />
      <section aria-label="Case studies" className="section">
        <div className="container-page">
          <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study) => (
              <RevealItem key={study.slug} className="h-full">
                <CaseStudyCard study={study} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      <CtaBand title="Your project could be next" highlight="next" />
    </>
  );
}
