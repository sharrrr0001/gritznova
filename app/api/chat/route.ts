import { NextResponse } from "next/server";
import { getProviderName, getSystemPrompt, LLMRateLimitError, streamChat } from "@/lib/llm";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  CHAT_MAX_HISTORY,
  CHAT_MAX_MESSAGE_CHARS,
  chatRequestSchema,
  sanitize,
} from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Streaming protocol: the response body is plain UTF-8 text deltas.
 * If something fails mid-stream, the server appends `[[ERROR:<message>]]`, which the client strips and shows.
 */
const ERROR_FALLBACK =
  "Sorry, I'm having trouble responding right now. You can reach the team directly through the contact form.";

function errorStream(message: string) {
  return new Response(`[[ERROR:${message}]]`, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);

  const burst = rateLimit(`chat:burst:${ip}`, 12, 60_000);
  const daily = rateLimit(`chat:day:${ip}`, 150, 24 * 60 * 60_000);
  if (!burst.ok || !daily.ok) {
    return NextResponse.json(
      { error: "You're sending messages quickly. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(Math.max(burst.retryAfterSeconds, 1)) } },
    );
  }

  const parsed = chatRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Keep the most recent turns, sanitize, and make sure the conversation starts with a user turn.
  let messages = parsed.data.messages
    .slice(-CHAT_MAX_HISTORY)
    .map((m) => ({ role: m.role, content: sanitize(m.content) }))
    .filter((m) => m.content.length > 0);
  while (messages[0]?.role === "assistant") messages = messages.slice(1);

  const last = messages.at(-1);
  if (!last || last.role !== "user") {
    return NextResponse.json({ error: "The last message must be from the user." }, { status: 400 });
  }
  if (last.content.length > CHAT_MAX_MESSAGE_CHARS) {
    return NextResponse.json(
      { error: `Messages are limited to ${CHAT_MAX_MESSAGE_CHARS} characters.` },
      { status: 413 },
    );
  }

  const provider = getProviderName();
  if (!provider) {
    console.error("[chat] No LLM key set (GEMINI_API_KEY or ANTHROPIC_API_KEY)");
    return errorStream(
      "The assistant isn't configured yet. Please use the contact form and we'll get right back to you.",
    );
  }

  const system = await getSystemPrompt();
  const encoder = new TextEncoder();
  const abort = new AbortController();
  req.signal.addEventListener("abort", () => abort.abort());

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const text of streamChat(provider, system, messages, abort.signal)) {
          controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        if (abort.signal.aborted) {
          controller.close();
          return;
        }
        let message = ERROR_FALLBACK;
        if (err instanceof LLMRateLimitError) {
          message = "I'm getting a lot of questions right now. Please try again in a minute.";
        } else {
          console.error(`[chat] ${provider} error`, err);
        }
        controller.enqueue(encoder.encode(`[[ERROR:${message}]]`));
      }
      controller.close();
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
