"use client";

export type AnalyticsEvent =
  | "cta_click"
  | "contact_submit"
  | "newsletter_submit"
  | "chat_open"
  | "chat_message"
  | "chat_lead"
  | "whatsapp_click";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: Props) => void;
    plausible?: (name: string, options?: { props?: Props }) => void;
  }
}

/** Sends an event to GA4 and/or Plausible, whichever is configured. Safe to call anywhere. */
export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, props);
    window.plausible?.(event, { props });
  } catch {
    // Analytics must never break the UI.
  }
}
