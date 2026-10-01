import { z } from "zod";
import { services } from "@/content/services";

/** Strip control characters and trim. Output is always rendered as text, never as HTML. */
export function sanitize(value: string) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

const text = (min: number, max: number, label: string) =>
  z
    .string()
    .transform(sanitize)
    .pipe(
      z
        .string()
        .min(min, min <= 1 ? `${label} is required` : `${label} must be at least ${min} characters`)
        .max(max, `${label} must be under ${max} characters`),
    );

const email = z.string().transform(sanitize).pipe(z.email("Enter a valid email address").max(200));

export const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const budgetOptions = [
  { value: "under-10k", label: "Under $10k" },
  { value: "10-25k", label: "$10k – $25k" },
  { value: "25-50k", label: "$25k – $50k" },
  { value: "50-100k", label: "$50k – $100k" },
  { value: "100k-plus", label: "$100k+" },
  { value: "unsure", label: "Not sure yet" },
] as const;

export const contactSchema = z.object({
  name: text(2, 100, "Name"),
  email,
  company: z.string().transform(sanitize).pipe(z.string().max(120)).optional().default(""),
  service: z.string().min(1, "Choose a service"),
  budget: z.string().min(1, "Choose a budget range"),
  message: text(20, 4000, "Message"),
  /** Honeypot: real users never see or fill this. */
  website: z.string().max(500).optional().default(""),
});
export type ContactInput = z.input<typeof contactSchema>;

export const leadSchema = z.object({
  name: text(2, 100, "Name"),
  email,
  details: text(5, 2000, "Project details"),
  website: z.string().max(500).optional().default(""),
  transcript: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(8000),
      }),
    )
    .max(60)
    .default([]),
});
export type LeadInput = z.input<typeof leadSchema>;

export const newsletterSchema = z.object({
  email,
  website: z.string().max(500).optional().default(""),
});

export const CHAT_MAX_MESSAGE_CHARS = 2000;
export const CHAT_MAX_HISTORY = 30;

export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(CHAT_MAX_HISTORY * 2),
});

export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
