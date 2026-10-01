import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { services } from "@/content/services";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center pt-32 pb-20">
      <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
      <div className="container-page flex flex-col items-center gap-6 text-center">
        <p className="text-accent-text font-mono text-sm">404 · route not found</p>
        <h1 className="text-h1 font-semibold">This page didn&apos;t ship</h1>
        <p className="text-lead text-fg-muted max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back
          on track.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            <ArrowLeft aria-hidden /> Back to home
          </Link>
          <Link href="/#contact" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Contact us
          </Link>
        </div>
        <nav aria-label="Popular pages" className="mt-8">
          <ul className="flex flex-wrap justify-center gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="border-border bg-surface text-fg-muted hover:text-fg inline-flex rounded-full border px-3.5 py-1.5 text-sm"
                >
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
