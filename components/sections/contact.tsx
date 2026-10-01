import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { site } from "@/content/site";
import { ContactForm } from "./contact-form";

export function Contact({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const details = [
    { icon: Mail, label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
    {
      icon: Phone,
      label: "Phone",
      value: site.contact.phone,
      href: `tel:${site.contact.phone.replace(/[^\d+]/g, "")}`,
    },
    ...(site.contact.whatsapp
      ? [
          {
            icon: MessageCircle,
            label: "WhatsApp",
            value: "Chat on WhatsApp",
            href: `https://wa.me/${site.contact.whatsapp}`,
          },
        ]
      : []),
    { icon: Clock, label: "Hours", value: site.contact.hours },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="section">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div className="flex flex-col gap-10">
          <SectionHeader
            id="contact-title"
            as={headingLevel}
            eyebrow="Contact"
            title="Tell us about your project"
            highlight="your project"
            subtitle={`Share a few details and we'll get back to you with next steps. ${site.contact.responseTime}`}
          />

          <ul className="flex flex-col gap-5">
            {details.map((d) => {
              const Icon = d.icon;
              const content = (
                <>
                  <span className="border-border bg-surface text-fg grid size-10 shrink-0 place-items-center rounded-xl border">
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-fg-subtle text-xs">{d.label}</span>
                    <span className="text-fg font-medium">{d.value}</span>
                  </span>
                </>
              );
              return (
                <li key={d.label}>
                  {d.href ? (
                    <a
                      href={d.href}
                      className="hover:text-accent-text flex items-center gap-4 rounded-xl transition-colors"
                      {...(d.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Location */}
          <div className="rounded-card border-border bg-surface overflow-hidden border">
            {site.location.mapEmbedUrl ? (
              <iframe
                title={`Map showing ${site.name} location`}
                src={site.location.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-48 w-full border-0"
              />
            ) : (
              <div className="bg-grid relative h-32 [mask-image:none]" aria-hidden>
                <span className="bg-accent text-accent-fg absolute top-1/2 left-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-lg">
                  <MapPin className="size-5" />
                </span>
              </div>
            )}
            <div className="border-border flex items-start justify-between gap-4 border-t p-4 text-sm">
              <div>
                <p className="text-fg font-medium">
                  {site.location.city}, {site.location.country}
                </p>
                <p className="text-fg-muted">{site.location.address}</p>
                <p className="text-fg-subtle mt-1">{site.location.serving}</p>
              </div>
              <a
                href={site.location.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-text shrink-0 font-medium hover:underline"
              >
                Directions
              </a>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
