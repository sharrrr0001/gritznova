import { NextResponse } from "next/server";
import { deliver } from "@/lib/deliver";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  if (!rateLimit(`newsletter:${ip}`, 5, 60 * 60_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = newsletterSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const ok = await deliver({
    type: "newsletter",
    subject: `Newsletter sign-up: ${parsed.data.email}`,
    fields: { Email: parsed.data.email },
  });
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Delivery failed" }, { status: 502 });
}
