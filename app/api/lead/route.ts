import { NextResponse } from "next/server";
import { complete, getProviderName } from "@/lib/llm";
import { deliver } from "@/lib/deliver";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { fieldErrors, leadSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 30;

type Turn = { role: "user" | "assistant"; content: string };

function plainTranscript(turns: Turn[]) {
  return turns
    .map((t) => `${t.role === "user" ? "Visitor" : "Nova"}: ${t.content}`)
    .join("\n\n")
    .slice(0, 12_000);
}

const SUMMARY_PROMPT =
  "You summarise website chat transcripts for a software consultancy's sales team. Write 3–6 short bullet points: what the visitor wants to build, the problem behind it, any timeline, budget, tech or company details mentioned, and the suggested next step. Use only facts from the transcript. If something wasn't mentioned, leave it out. Output only the bullets.";

/** Asks the configured LLM for a short sales-ready summary of the chat. Null on any failure. */
async function summarize(turns: Turn[]): Promise<string | null> {
  const provider = getProviderName();
  if (!provider || turns.length === 0) return null;
  try {
    return await complete(
      provider,
      SUMMARY_PROMPT,
      `<transcript>
${plainTranscript(turns)}
</transcript>`,
    );
  } catch (err) {
    console.error("[lead] summary failed", err);
    return null;
  }
}

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  if (!rateLimit(`lead:${ip}`, 4, 10 * 60_000).ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again shortly." },
      { status: 429 },
    );
  }

  const parsed = leadSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your details.", errors: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }
  const { name, email, details, website, transcript } = parsed.data;
  if (website) return NextResponse.json({ ok: true });

  const summary = await summarize(transcript);

  const ok = await deliver({
    type: "chat-lead",
    subject: `New chat lead: ${name}`,
    replyTo: email,
    fields: {
      Name: name,
      Email: email,
      "Project details": details,
      "Chat summary": summary ?? "(summary unavailable)",
      Transcript: plainTranscript(transcript) || "(no transcript)",
    },
  });

  if (!ok) {
    return NextResponse.json(
      { error: "We couldn't send your details. Please use the contact form." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
