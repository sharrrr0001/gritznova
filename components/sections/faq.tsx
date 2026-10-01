import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/ui/section-header";
import type { Faq as FaqType } from "@/content/types";
import { Chevron } from "@/components/layout/logo";

export function Faq({ faqs }: { faqs: FaqType[] }) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="section border-border bg-surface/40 border-t"
    >
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <SectionHeader
            id="faq-title"
            eyebrow="FAQ"
            title="Questions, answered"
            highlight="answered"
            subtitle="Straight answers on pricing, timelines and how we work together."
          />
          <p className="text-fg-muted text-sm">
            Still have questions?{" "}
            <Link
              href="/#contact"
              className="text-accent-text inline-flex items-center gap-1 font-medium hover:underline"
            >
              Talk to us <Chevron />
            </Link>
          </p>
        </div>

        <Accordion type="single" collapsible className="border-border border-t">
          {faqs.map((f, i) => (
            <AccordionItem key={f.question} value={`item-${i}`}>
              <AccordionTrigger>{f.question}</AccordionTrigger>
              <AccordionContent>{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
