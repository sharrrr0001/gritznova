"use client";

import { site } from "@/content/site";
import { track } from "@/lib/analytics";

/** WhatsApp handoff. Renders nothing unless NEXT_PUBLIC_WHATSAPP_NUMBER is set. */
export function WhatsAppButton({
  message = "Hi GRITZNOVA, I'd like to discuss a project.",
}: {
  message?: string;
}) {
  if (!site.contact.whatsapp) return null;
  const href = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { from: "chat" })}
      className="border-border-strong text-fg hover:bg-surface-2 inline-flex h-9 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors"
    >
      <svg viewBox="0 0 24 24" className="size-4 text-[#25D366]" fill="currentColor" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.43 9.43 0 1 1 7.99 4.42Zm8.02-17.45A11.3 11.3 0 0 0 12.04.75C5.8.75.72 5.83.72 12.08c0 2 .52 3.95 1.52 5.66L.62 23.25l5.65-1.48a11.3 11.3 0 0 0 5.77 1.47h.01c6.24 0 11.32-5.08 11.33-11.33a11.26 11.26 0 0 0-3.32-8.01Z" />
      </svg>
      Chat on WhatsApp
    </a>
  );
}
