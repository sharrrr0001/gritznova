import { TrackedLink } from "@/components/layout/tracked-link";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { HighlightedTitle } from "@/components/ui/section-header";
import { bookingHref, site } from "@/content/site";
import { Chevron } from "@/components/layout/logo";

interface CtaBandProps {
  title?: string;
  highlight?: string;
  subtitle?: string;
}

export function CtaBand({
  title = "Let's build what's next for your business",
  highlight = "what's next",
  subtitle = "Tell us where you want to go. In 30 minutes we'll map a practical path to get there, free and with no obligation.",
}: CtaBandProps) {
  return (
    <section aria-label="Get started" className="section">
      <div className="container-page">
        <Reveal className="border-border bg-surface relative isolate overflow-hidden rounded-[1.5rem] border px-6 py-16 text-center shadow-lg sm:px-12 sm:py-20">
          <div
            className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000,transparent)]"
            aria-hidden
          />
          <div
            aria-hidden
            className="brand-glow absolute top-1/2 left-1/2 -z-10 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          />
          <h2 className="text-h2 mx-auto max-w-3xl font-semibold">
            <HighlightedTitle title={title} highlight={highlight} />
          </h2>
          <p className="text-lead text-fg-muted mx-auto mt-4 max-w-xl">{subtitle}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <TrackedLink
              href={bookingHref}
              event="cta_band_book"
              className={buttonVariants({ size: "lg" })}
            >
              {site.booking.label} <Chevron />
            </TrackedLink>
            <TrackedLink
              href={`mailto:${site.contact.email}`}
              event="cta_band_email"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Email us
            </TrackedLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
