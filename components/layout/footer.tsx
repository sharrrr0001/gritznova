import Link from "next/link";
import { caseStudies } from "@/content/work";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { GithubIcon, LinkedinIcon } from "./social-icons";

const columns = [
  {
    title: "Services",
    links: services.map((s) => ({ label: s.shortTitle, href: `/services/${s.slug}` })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Work", href: "/work" },
      { label: "Insights", href: "/insights" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Case studies",
    links: caseStudies.map((c) => ({ label: c.industry, href: `/work/${c.slug}` })),
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { label: "LinkedIn", href: site.socials.linkedin, icon: <LinkedinIcon /> },
    { label: "GitHub", href: site.socials.github, icon: <GithubIcon /> },
  ].filter((s) => s.href);

  return (
    <footer className="border-border bg-surface border-t">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-4">
          <Logo />
          <p className="text-fg-muted max-w-xs text-sm">{site.positioning}</p>
          <ul className="flex gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GRITZNOVA on ${s.label}`}
                  className="border-border text-fg-muted hover:border-border-strong hover:text-fg grid size-10 place-items-center rounded-full border transition-colors"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-fg-subtle mb-4 font-mono text-xs tracking-[0.14em] uppercase">
                {col.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-fg-muted hover:text-fg text-sm transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="lg:col-span-3">
          <NewsletterForm />
        </div>
      </div>

      <div className="border-border border-t">
        <div className="container-page text-fg-subtle flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy" className="hover:text-fg">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-fg">
                Terms
              </Link>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="hover:text-fg">
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
