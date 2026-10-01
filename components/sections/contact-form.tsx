"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Honeypot, Input, Select, Textarea } from "@/components/ui/field";
import { track } from "@/lib/analytics";
import {
  budgetOptions,
  contactSchema,
  fieldErrors,
  serviceOptions,
  type ContactInput,
} from "@/lib/schemas";

const initial: ContactInput = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  message: "",
  website: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "pending" | "success">("idle");

  const set = (key: keyof ContactInput) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key])
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
  };

  const describedBy = (key: string) => (errors[key] ? `${key}-error` : undefined);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      const first = Object.keys(errs)[0];
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    setStatus("pending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as {
        errors?: Record<string, string>;
        error?: string;
      };
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error ?? "Something went wrong");
      }
      track("contact_submit", { service: parsed.data.service, budget: parsed.data.budget });
      setStatus("success");
      setValues(initial);
    } catch (err) {
      setStatus("idle");
      toast.error("Message not sent", {
        description: err instanceof Error ? err.message : "Please try again or email us directly.",
      });
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-card border-border bg-surface flex min-h-[420px] flex-col items-center justify-center gap-4 border p-10 text-center"
      >
        <CheckCircle2 className="text-success size-12" aria-hidden />
        <h3 className="text-h3 font-semibold">Thanks, we&apos;ve got your message</h3>
        <p className="text-fg-muted max-w-sm">
          A senior member of our team will reply within one business day, usually much sooner.
        </p>
        <Button variant="secondary" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Contact form"
      className="rounded-card border-border bg-surface relative grid gap-5 border p-6 shadow-sm sm:grid-cols-2 sm:p-8"
    >
      <Field id="contact-name" label="Name" error={errors.name}>
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => set("name")(e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy("contact-name")}
          required
        />
      </Field>
      <Field id="contact-email" label="Work email" error={errors.email}>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => set("email")(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("contact-email")}
          required
        />
      </Field>
      <Field
        id="contact-company"
        label="Company"
        optional
        error={errors.company}
        className="sm:col-span-2"
      >
        <Input
          id="contact-company"
          name="company"
          autoComplete="organization"
          value={values.company}
          onChange={(e) => set("company")(e.target.value)}
        />
      </Field>
      <Field id="contact-service" label="Service" error={errors.service}>
        <Select
          id="contact-service"
          name="service"
          value={values.service}
          onChange={(e) => set("service")(e.target.value)}
          aria-invalid={Boolean(errors.service)}
          aria-describedby={describedBy("contact-service")}
          required
        >
          <option value="" disabled>
            Select a service
          </option>
          {serviceOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field id="contact-budget" label="Budget range" error={errors.budget}>
        <Select
          id="contact-budget"
          name="budget"
          value={values.budget}
          onChange={(e) => set("budget")(e.target.value)}
          aria-invalid={Boolean(errors.budget)}
          aria-describedby={describedBy("contact-budget")}
          required
        >
          <option value="" disabled>
            Select a range
          </option>
          {budgetOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field
        id="contact-message"
        label="Project details"
        error={errors.message}
        hint="What are you building, and what does success look like?"
        className="sm:col-span-2"
      >
        <Textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : "contact-message-hint"}
          required
        />
      </Field>

      <Honeypot value={values.website ?? ""} onChange={set("website")} />

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-fg-subtle text-xs">
          By submitting, you agree to our{" "}
          <a href="/privacy" className="hover:text-fg underline">
            privacy policy
          </a>
          . We never share your details.
        </p>
        <Button type="submit" size="lg" disabled={status === "pending"} className="sm:min-w-44">
          {status === "pending" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              Send message <Send aria-hidden />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
