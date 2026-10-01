/**
 * Simple sliding-window rate limiter, keyed by IP.
 *
 * In-memory, so limits apply per server instance. That's enough to stop casual abuse.
 * For strict global limits across serverless instances, swap the Map for Upstash Redis
 * (`@upstash/ratelimit`) or Netlify Blobs. The function signature can stay the same.
 */
type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0] ?? now;
    buckets.set(key, bucket);
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((windowMs - (now - oldest)) / 1000),
    };
  }

  bucket.hits.push(now);
  if (buckets.size >= MAX_KEYS && !buckets.has(key)) {
    // Drop the oldest key to bound memory.
    const first = buckets.keys().next().value;
    if (first !== undefined) buckets.delete(first);
  }
  buckets.set(key, bucket);
  return { ok: true, remaining: limit - bucket.hits.length, retryAfterSeconds: 0 };
}

export function getClientIp(headers: Headers) {
  return (
    headers.get("x-nf-client-connection-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
