/**
 * Global company details. Values in [square brackets] are placeholders — replace them.
 * Search the repo for "[" + "PLACEHOLDER" or see README → "Placeholders to replace".
 */
export const site = {
  name: "GRITZNOVA",
  legalName: "GRITZNOVA [Pvt] Ltd",
  tagline: "Software, AI and cloud engineering",
  positioning: "We help businesses build, scale and transform with modern software, AI and cloud.",
  description:
    "GRITZNOVA is a software engineering partner for custom software, AI & machine learning, cloud, DevOps and digital transformation. We help businesses build, scale and transform.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gritznova.com",
  location: {
    city: "[City]",
    country: "[Country]",
    address: "[Street address, City, Postal code, Country]",
    serving: "Serving clients globally",
    /** Optional Google Maps / OpenStreetMap embed URL. Leave empty to show a static location card. */
    mapEmbedUrl: "",
    mapLink: "https://maps.google.com/?q=[your+address]",
  },
  contact: {
    email: "[hello@gritznova.com]",
    phone: "[+00 00 000 0000]",
    // wa.me links need digits only, so "+91 91091 17233" becomes "919109117233".
    whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""),
    hours: "Mon–Fri, 9:00–18:00 [timezone]",
    responseTime: "We reply within one business day.",
  },
  socials: {
    linkedin: "https://www.linkedin.com/company/[gritznova]",
    github: "https://github.com/[gritznova]",
    x: "",
  },
  booking: {
    /** Calendly / Cal.com link. If empty, "Book a consultation" buttons scroll to the contact form. */
    url: "",
    label: "Book a free consultation",
  },
  founded: "[YYYY]",
} as const;

export const nav = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/#contact" },
] as const;

export const bookingHref = site.booking.url || "/#contact";
