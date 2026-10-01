import { ShieldCheck } from "lucide-react";
import { TrackedLink } from "@/components/layout/tracked-link";
import { buttonVariants } from "@/components/ui/button";
import { bookingHref } from "@/content/site";
import { Chevron } from "@/components/layout/logo";
import { HeroVisual } from "@/components/hero/hero-visual";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-32 lg:pb-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 right-[-18%] -z-10 h-[740px] w-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,rgb(225_6_0/0.08),transparent_65%)] blur-3xl sm:right-[-8%]"
      />
      <div
        aria-hidden
        className="via-border pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent to-transparent"
      />

      <div className="container-page grid items-center gap-8 sm:gap-12 lg:grid-cols-[0.96fr_1.12fr] lg:gap-6 xl:gap-10">
        <div className="relative z-10 flex min-w-0 flex-col items-start gap-6 sm:gap-7">
          <p className="text-fg-muted inline-flex animate-[fade-up_0.6s_var(--ease-out-quart)_both] items-center gap-3 font-mono text-[0.6875rem] font-medium tracking-[0.16em] uppercase">
            <span aria-hidden className="bg-brand h-px w-7" />
            Engineering the digital future
          </p>

          <h1
            id="hero-title"
            className="text-display text-fg max-w-[620px] animate-[fade-up_0.7s_var(--ease-out-quart)_0.05s_both] font-semibold"
          >
            Build. Scale. <span className="text-brand">Transform.</span>
          </h1>

          <p className="text-lead text-fg-muted max-w-[500px] animate-[fade-up_0.6s_var(--ease-out-quart)_0.1s_both]">
            Modern software, AI and cloud engineering built around the way your business actually
            works.
          </p>

          <div className="flex w-full animate-[fade-up_0.6s_var(--ease-out-quart)_0.2s_both] flex-col gap-3 sm:w-auto sm:flex-row">
            <TrackedLink
              href={bookingHref}
              event="hero_book"
              className={buttonVariants({ size: "lg" })}
            >
              Book a Consultation
              <Chevron />
            </TrackedLink>
            <TrackedLink
              href="/#work"
              event="hero_work"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Explore Our Work
            </TrackedLink>
          </div>

          <p className="text-fg-subtle flex max-w-[460px] animate-[fade-up_0.6s_var(--ease-out-quart)_0.3s_both] items-start gap-2 text-xs leading-relaxed sm:text-sm">
            <ShieldCheck className="text-fg-muted mt-0.5 size-4 shrink-0" aria-hidden />
            Free 30-minute consultation · NDA on request · Reply within one business day
          </p>
        </div>

        <div className="relative w-full min-w-0 lg:-mr-6 xl:-mr-10">
          <HeroVisual className="mx-auto aspect-[1/0.92] w-full max-w-[680px] max-lg:aspect-auto max-lg:h-[min(92vw,420px)]" />
        </div>
      </div>
    </section>
  );
}
