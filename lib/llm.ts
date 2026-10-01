import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { ApiError, FinishReason, GoogleGenAI } from "@google/genai";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Provider-neutral chat layer for Nova.
 *
 *   Gemini (default, free tier)  GEMINI_API_KEY     [GEMINI_MODEL, default "gemini-flash-latest"]
 *   Claude (Anthropic)           ANTHROPIC_API_KEY  [ANTHROPIC_MODEL, default "claude-sonnet-5-5"]
 *
 * If both keys are set, Gemini is used unless LLM_PROVIDER=anthropic.
 */

export type Turn = { role: "user" | "assistant"; content: string };
export type ProviderName = "gemini" | "anthropic";

/** Thrown when the provider is rate limiting us (e.g. free-tier quota reached). */
export class LLMRateLimitError extends Error {}

const REFUSAL_TEXT =
  "I can't help with that one, but I'm happy to answer questions about GRITZNOVA's services or your project.";

export function getProviderName(): ProviderName | null {
  const preferred = process.env.LLM_PROVIDER?.toLowerCase();
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
  if (preferred === "anthropic" && hasAnthropic) return "anthropic";
  if (preferred === "gemini" && hasGemini) return "gemini";
  if (hasGemini) return "gemini";
  if (hasAnthropic) return "anthropic";
  return null;
}

let cachedPrompt: string | null = null;

/** Loads /content/chatbot-system-prompt.md once per server instance (re-read on every request in dev). */
export async function getSystemPrompt() {
  if (cachedPrompt && process.env.NODE_ENV === "production") return cachedPrompt;
  const file = path.join(process.cwd(), "content", "chatbot-system-prompt.md");
  cachedPrompt = await readFile(file, "utf8");
  return cachedPrompt;
}

// ─── Gemini ──────────────────────────────────────────────────────────────────

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
/**
 * Free-tier models are sometimes overloaded (503) or rate limited (429). When that happens we move
 * on to the next model in this list. Override with GEMINI_FALLBACK_MODELS="model-a,model-b".
 */
const GEMINI_FALLBACKS = (
  process.env.GEMINI_FALLBACK_MODELS || "gemini-flash-lite-latest,gemini-3.7-flash"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);
/** A model that just failed is skipped for this long, so later visitors don't wait on it. */
const COOLDOWN_MS = 60_000;
/** Give up on a model that hasn't started answering within this time. */
const FIRST_TOKEN_TIMEOUT_MS = 15_000;

let gemini: GoogleGenAI | null = null;
const coolingUntil = new Map<string, number>();

function getGemini() {
  gemini ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return gemini;
}

/** Models to try, in order: healthy ones first, cooling-down ones last (never an empty list). */
function geminiModels() {
  const all = [...new Set([GEMINI_MODEL, ...GEMINI_FALLBACKS])];
  const now = Date.now();
  const healthy = all.filter((m) => (coolingUntil.get(m) ?? 0) <= now);
  return healthy.length ? [...healthy, ...all.filter((m) => !healthy.includes(m))] : all;
}

function toGeminiContents(messages: Turn[]) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

/** Overloaded, rate limited, retired or timed out: worth trying the next model. */
function isRetryable(err: unknown) {
  if (err instanceof ApiError) return [404, 429, 500, 502, 503, 504].includes(err.status);
  return err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
}

async function* geminiStream(system: string, messages: Turn[], signal: AbortSignal) {
  const contents = toGeminiContents(messages);
  let lastError: unknown;

  for (const model of geminiModels()) {
    if (signal.aborted) return;
    // Per-attempt timeout, combined with the visitor's own cancel signal.
    const attempt = new AbortController();
    const timer = setTimeout(
      () => attempt.abort(new DOMException("timeout", "TimeoutError")),
      FIRST_TOKEN_TIMEOUT_MS,
    );
    const onAbort = () => attempt.abort();
    signal.addEventListener("abort", onAbort);
    let sent = false;
    try {
      const stream = await getGemini().models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: system,
          maxOutputTokens: 1500,
          temperature: 0.5,
          abortSignal: attempt.signal,
        },
      });
      let blocked = false;
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          if (!sent) clearTimeout(timer);
          sent = true;
          yield text;
        }
        const reason = chunk.candidates?.[0]?.finishReason;
        if (chunk.promptFeedback?.blockReason || reason === FinishReason.SAFETY) blocked = true;
        if (reason === FinishReason.MAX_TOKENS) yield "…";
      }
      if (blocked || !sent) yield `${sent ? "\n\n" : ""}${REFUSAL_TEXT}`;
      return;
    } catch (err) {
      lastError = err;
      // Once text has streamed we can't switch models mid-answer; and a visitor cancel is final.
      if (sent || signal.aborted || !isRetryable(err)) break;
      coolingUntil.set(model, Date.now() + COOLDOWN_MS);
      console.warn(
        `[chat] Gemini model "${model}" unavailable, trying next`,
        err instanceof ApiError ? err.status : err,
      );
    } finally {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
    }
  }

  if (lastError instanceof ApiError && lastError.status === 429)
    throw new LLMRateLimitError(lastError.message);
  throw lastError ?? new Error("No Gemini model available");
}

async function geminiComplete(system: string, prompt: string) {
  let lastError: unknown;
  for (const model of geminiModels()) {
    try {
      const res = await getGemini().models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: system,
          maxOutputTokens: 800,
          temperature: 0.2,
          abortSignal: AbortSignal.timeout(20_000),
        },
      });
      return res.text?.trim() || null;
    } catch (err) {
      lastError = err;
      if (!isRetryable(err)) break;
      coolingUntil.set(model, Date.now() + COOLDOWN_MS);
    }
  }
  if (lastError instanceof ApiError && lastError.status === 429)
    throw new LLMRateLimitError(lastError.message);
  throw lastError;
}

// ─── Anthropic (Claude) ──────────────────────────────────────────────────────

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
/** Server-side fallback: a declined request is re-run on Anthropic's recommended fallback model. */
const FALLBACK_BETA = "server-side-fallback-2026-07-01";
let anthropic: Anthropic | null = null;

function getAnthropic() {
  anthropic ??= new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    maxRetries: 2,
    timeout: 60_000,
  });
  return anthropic;
}

function rethrowAnthropic(err: unknown): never {
  if (err instanceof Anthropic.RateLimitError) throw new LLMRateLimitError(err.message);
  throw err;
}

async function* anthropicStream(system: string, messages: Turn[], signal: AbortSignal) {
  try {
    const stream = getAnthropic().beta.messages.stream(
      {
        model: ANTHROPIC_MODEL,
        max_tokens: 1500,
        // Stable system prompt is cached across requests to cut latency and cost.
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        messages,
        thinking: { type: "adaptive" },
        // Website chat is latency-sensitive and the answers are short: low effort keeps replies quick.
        output_config: { effort: "low" },
        betas: [FALLBACK_BETA],
        fallbacks: "default",
      },
      { signal },
    );
    let sent = false;
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        sent = true;
        yield event.delta.text;
      }
    }
    const final = await stream.finalMessage();
    if (final.stop_reason === "refusal") yield `${sent ? "\n\n" : ""}${REFUSAL_TEXT}`;
    else if (final.stop_reason === "max_tokens") yield "…";
  } catch (err) {
    rethrowAnthropic(err);
  }
}

async function anthropicComplete(system: string, prompt: string) {
  try {
    const res = await getAnthropic().beta.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 1000,
      output_config: { effort: "low" },
      betas: [FALLBACK_BETA],
      fallbacks: "default",
      system,
      messages: [{ role: "user", content: prompt }],
    });
    if (res.stop_reason === "refusal") return null;
    const text = res.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return text || null;
  } catch (err) {
    rethrowAnthropic(err);
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Streams the assistant's reply as text deltas. */
export function streamChat(
  provider: ProviderName,
  system: string,
  messages: Turn[],
  signal: AbortSignal,
) {
  return provider === "gemini"
    ? geminiStream(system, messages, signal)
    : anthropicStream(system, messages, signal);
}

/** One-shot completion (used for the lead summary). */
export function complete(provider: ProviderName, system: string, prompt: string) {
  return provider === "gemini" ? geminiComplete(system, prompt) : anthropicComplete(system, prompt);
}
