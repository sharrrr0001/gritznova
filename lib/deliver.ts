import "server-only";

/**
 * Delivers form submissions and chatbot leads to whatever destination is configured:
 *   - Resend email   (RESEND_API_KEY + LEAD_TO_EMAIL [+ LEAD_FROM_EMAIL])
 *   - JSON webhook   (LEAD_WEBHOOK_URL: Formspree, Zapier, Make, Google Apps Script, CRM…)
 * Both can be enabled at once. Returns false only if every configured destination failed.
 */
export interface Delivery {
  type: "contact" | "chat-lead" | "newsletter";
  subject: string;
  replyTo?: string;
  fields: Record<string, string>;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

async function sendResend(d: Delivery) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  if (!key || !to) return null;

  const rows = Object.entries(d.fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#555;vertical-align:top"><strong>${escapeHtml(k)}</strong></td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL ?? "GRITZNOVA Website <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      reply_to: d.replyTo,
      subject: d.subject,
      html: `<div style="font-family:system-ui,sans-serif;font-size:14px"><h2 style="margin:0 0 12px">${escapeHtml(d.subject)}</h2><table>${rows}</table></div>`,
      text: Object.entries(d.fields)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n\n"),
    }),
  });
  return res.ok;
}

async function sendWebhook(d: Delivery) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return null;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      type: d.type,
      subject: d.subject,
      submittedAt: new Date().toISOString(),
      ...d.fields,
    }),
  });
  return res.ok;
}

export async function deliver(d: Delivery): Promise<boolean> {
  const results = await Promise.allSettled([sendResend(d), sendWebhook(d)]);
  const attempted = results.filter((r) => !(r.status === "fulfilled" && r.value === null));

  if (attempted.length === 0) {
    // Nothing configured: log so local development still "works", and don't lose the submission silently.
    console.warn(
      `[deliver] No destination configured (RESEND_API_KEY/LEAD_WEBHOOK_URL). ${d.type}:`,
      d.fields,
    );
    return process.env.NODE_ENV !== "production";
  }

  const ok = attempted.some((r) => r.status === "fulfilled" && r.value === true);
  if (!ok) console.error("[deliver] All destinations failed", results);
  return ok;
}
