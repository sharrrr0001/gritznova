import type { LucideIcon } from "lucide-react";

/** Anything marked `placeholder: true` renders a visible "Placeholder" tag until you replace it with real data. */
export interface Placeholderable {
  placeholder?: boolean;
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  /** Two-line value statement used on cards. */
  value: string;
  capabilities: [string, string, string];
  /** Detail page */
  headline: string;
  intro: string;
  outcomes: { title: string; body: string }[];
  deliverables: string[];
  stack: string[];
  idealFor: string[];
}

export interface CaseStudy extends Placeholderable {
  slug: string;
  client: string;
  industry: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  result: { metric: string; label: string };
  tech: string[];
  services: string[];
  /** Generated cover art style (0–2), used until you add a real `image`. */
  coverVariant: number;
  image?: string;
  body: { heading: string; paragraphs: string[] }[];
  year: string;
}

export interface Testimonial extends Placeholderable {
  quote: string;
  name: string;
  role: string;
  company: string;
  photo?: string;
}

export interface Stat extends Placeholderable {
  /** Leave null until you have a real, verifiable number. */
  value: number | null;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface TeamMember extends Placeholderable {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  linkedin?: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  duration: string;
  body: string;
  outputs: string[];
}

export interface Differentiator {
  icon: LucideIcon;
  title: string;
  body: string;
  proof: string;
}

export interface StackGroup {
  name: string;
  items: string[];
}

export interface ClientLogo extends Placeholderable {
  name: string;
  /** Path under /public, e.g. "/logos/acme.svg". */
  logo?: string;
}

export interface Job {
  slug: string;
  title: string;
  location: string;
  type: string;
  summary: string;
}
