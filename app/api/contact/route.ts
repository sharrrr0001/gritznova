import { NextResponse } from "next/server";
import { deliver } from "@/lib/deliver";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { budgetOptions, contactSchema, fieldErrors, serviceOptions } from "@/lib/schemas";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const body: unknown = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const data = parsed.data;
  // Honeypot filled → pretend success so bots learn nothing.
  if (data.website) return NextResponse.json({ ok: true });

  const service = serviceOptions.find((o) => o.value === data.service)?.label ?? data.service;
  const budget = budgetOptions.find((o) => o.value === data.budget)?.label ?? data.budget;

  const ok = await deliver({
    type: "contact",
    subject: `New enquiry: ${data.name}${data.company ? ` (${data.company})` : ""}, ${service}`,
    replyTo: data.email,
    fields: {
      Name: data.name,
      Email: data.email,
      Company: data.company || "-",
      Service: service,
      Budget: budget,
      Message: data.message,
    },
  });

  if (!ok) {
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please email us directly." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
