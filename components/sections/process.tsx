import { Chevron } from "@/components/layout/logo";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { processSteps } from "@/content/home";

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="section border-border bg-surface/40 border-t"
    >
      <div className="container-page flex flex-col gap-16">
        <SectionHeader
          id="process-title"
          eyebrow="Our process"
          title="From first call to production, without the guesswork"
          highlight="production"
          subtitle="A clear, proven path. You'll always know what's happening, what's next and why."
          align="center"
        />

        <RevealGroup className="relative grid gap-10 lg:grid-cols-5 lg:gap-6" stagger={0.1}>
          {/* Connector line */}
          <div
            aria-hidden
            className="from-border-strong via-border-strong absolute top-2 bottom-2 left-[19px] w-px bg-linear-to-b to-transparent lg:top-[19px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:bg-linear-to-r"
          />
          {processSteps.map((step, i) => (
            <RevealItem key={step.title} className="relative flex gap-5 lg:flex-col lg:gap-6">
              <span className="border-border-strong bg-bg text-fg relative z-10 grid size-10 shrink-0 place-items-center rounded-full border font-mono text-sm font-medium shadow-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* The logo chevron marks the flow from one step to the next. */}
              {i < processSteps.length - 1 ? (
                <span
                  aria-hidden
                  className="text-brand absolute -bottom-[30px] left-[13px] z-10 grid h-5 w-3.5 rotate-90 place-items-center lg:top-[10px] lg:-right-[19px] lg:bottom-auto lg:left-auto lg:rotate-0"
                >
                  <Chevron className="h-3.5" />
                </span>
              ) : null}
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-3 lg:flex-col lg:gap-1">
                  <h3 className="text-h3 font-semibold">{step.title}</h3>
                  <span className="text-fg-subtle font-mono text-xs">{step.duration}</span>
                </div>
                <p className="text-fg-muted text-[0.9375rem]">{step.body}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {step.outputs.map((o) => (
                    <li
                      key={o}
                      className="bg-surface-2 text-fg-muted rounded-md px-2 py-0.5 text-xs"
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
