import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { techStack } from "@/content/home";

export function TechStack() {
  return (
    <section aria-labelledby="stack-title" className="section">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <SectionHeader
          id="stack-title"
          eyebrow="Tech stack"
          title="Modern, proven tools, chosen for your problem"
          highlight="your problem"
          subtitle="We're pragmatic about technology. We pick what's reliable, well supported and right for your team to own."
        />

        <RevealGroup className="divide-border rounded-card border-border bg-surface divide-y border">
          {techStack.map((group) => (
            <RevealItem
              key={group.name}
              className="grid gap-3 p-5 sm:grid-cols-[140px_1fr] sm:items-center sm:gap-6 sm:p-6"
            >
              <h3 className="text-fg-subtle font-mono text-xs tracking-[0.14em] uppercase">
                {group.name}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-border bg-surface-2 text-fg hover:border-border-strong rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
