"use client";

import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { track } from "@/lib/analytics";
import { newsletterSchema } from "@/lib/schemas";
import { Chevron } from "@/components/layout/logo";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = newsletterSchema.safeParse({ email, website });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    setPending(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error();
      track("newsletter_submit");
      toast.success("You're subscribed", { description: "Thanks! Look out for our next insight." });
      setEmail("");
    } catch {
      toast.error("Couldn't subscribe", { description: "Please try again in a moment." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
      <label htmlFor="newsletter-email" className="text-fg text-sm font-medium">
        Engineering insights, monthly
      </label>
      <div className="relative flex">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="border-border-strong bg-surface text-fg placeholder:text-fg-subtle focus:border-accent focus:ring-accent-soft aria-[invalid=true]:border-error h-11 w-full rounded-full border pr-12 pl-4 text-sm focus:ring-4 focus:outline-none"
        />
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute -left-[9999px] h-px w-px"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Subscribe"
          className="bg-accent text-accent-fg hover:bg-accent-hover absolute top-1 right-1 grid size-9 place-items-center rounded-full transition-colors disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Chevron />}
        </button>
      </div>
      {error ? (
        <p id="newsletter-error" className="text-error text-sm" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-fg-subtle text-xs">No spam. Unsubscribe anytime.</p>
      )}
    </form>
  );
}
