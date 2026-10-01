"use client";

import { Loader2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { fieldErrors, leadSchema } from "@/lib/schemas";
import { WhatsAppButton } from "./whatsapp-button";

export interface LeadValues {
  name: string;
  email: string;
  details: string;
}

interface ChatLeadFormProps {
  initial: Partial<LeadValues>;
  transcript: { role: "user" | "assistant"; content: string }[];
  onSubmitted: (name: string) => void;
  onDismiss: () => void;
}

const inputCls =
  "h-10 w-full rounded-lg border border-border-strong bg-surface px-3 text-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-soft aria-[invalid=true]:border-error";

export function ChatLeadForm({ initial, transcript, onSubmitted, onDismiss }: ChatLeadFormProps) {
  const [values, setValues] = useState<LeadValues>({
    name: initial.name ?? "",
    email: initial.email ?? "",
    details: initial.details ?? "",
  });
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string>();

  const update = (key: keyof LeadValues, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = { ...values, website, transcript: transcript.slice(-40) };
    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setPending(true);
    setFormError(undefined);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        errors?: Record<string, string>;
      };
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error ?? "Something went wrong.");
      }
      onSubmitted(parsed.data.name);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Share your contact details"
      className="border-border bg-surface ml-9 flex flex-col gap-3 rounded-xl border p-4 shadow-sm"
    >
      <div>
        <p className="text-fg text-sm font-semibold">Connect with our team</p>
        <p className="text-fg-muted text-xs">We&apos;ll reply within one business day.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="lead-name" className="text-fg-muted text-xs font-medium">
          Name
        </label>
        <input
          id="lead-name"
          className={inputCls}
          autoComplete="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "lead-name-error" : undefined}
        />
        {errors.name ? (
          <p id="lead-name-error" className="text-error text-xs">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="lead-email" className="text-fg-muted text-xs font-medium">
          Email
        </label>
        <input
          id="lead-email"
          type="email"
          className={inputCls}
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "lead-email-error" : undefined}
        />
        {errors.email ? (
          <p id="lead-email-error" className="text-error text-xs">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="lead-details" className="text-fg-muted text-xs font-medium">
          Project details
        </label>
        <textarea
          id="lead-details"
          rows={3}
          className={`${inputCls} h-auto resize-none py-2`}
          value={values.details}
          onChange={(e) => update("details", e.target.value)}
          aria-invalid={Boolean(errors.details)}
          aria-describedby={errors.details ? "lead-details-error" : undefined}
        />
        {errors.details ? (
          <p id="lead-details-error" className="text-error text-xs">
            {errors.details}
          </p>
        ) : null}
      </div>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-px w-px"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      {formError ? (
        <p role="alert" className="text-error text-xs">
          {formError}
        </p>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent text-accent-fg hover:bg-accent-hover inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-colors disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4" aria-hidden />
          )}
          {pending ? "Sending…" : "Send to the team"}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="text-fg-muted hover:bg-surface-2 hover:text-fg h-9 rounded-full px-3 text-sm"
        >
          Not now
        </button>
      </div>
      <WhatsAppButton />
    </form>
  );
}
