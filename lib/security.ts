/**
 * Pure, unit-testable helpers for chat-route security:
 *  - PII redaction (Aadhaar, OTP, long ID runs)
 *  - Token-bucket style in-memory rate limiter (per-IP)
 *
 * Keeping these here lets us write Vitest coverage without booting Next.
 */

const AADHAAR_RE = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g
// Match "otp" / "one-time password" followed by up to ~15 non-digit chars
// before a 4-8 digit code (catches "the otp is 123456", "OTP: 9876", etc.).
const OTP_RE = /\b(?:otp|one[-\s]?time[-\s]?password)\b[^\d\n]{0,15}\d{4,8}\b/gi
const LONG_ID_RE = /\b\d{12,}\b/g

/**
 * Redacts personally-identifying numeric strings from user text before it
 * ever reaches the model. Best-effort — never rely on this alone for security.
 */
export function redactPII(text: string): string {
  if (typeof text !== "string" || text.length === 0) return text
  return text
    .replace(AADHAAR_RE, "[redacted:aadhaar]")
    .replace(OTP_RE, "[redacted:otp]")
    .replace(LONG_ID_RE, "[redacted:id]")
}

type Bucket = { count: number; resetAt: number }

export interface RateLimiter {
  check(key: string): { ok: boolean; retryAfter: number }
  reset(): void
}

/**
 * Creates an in-memory, per-instance rate limiter.
 *
 * For production-grade guarantees across many serverless instances, swap this
 * out for a Redis / Upstash backed limiter. This implementation is enough to
 * shield cold-start bursts and abuse from a single IP.
 */
export function createRateLimiter(max: number, windowMs: number): RateLimiter {
  const buckets = new Map<string, Bucket>()

  return {
    check(key: string) {
      const now = Date.now()
      const bucket = buckets.get(key)

      if (!bucket || bucket.resetAt < now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs })
        return { ok: true, retryAfter: 0 }
      }

      if (bucket.count >= max) {
        return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
      }

      bucket.count += 1
      return { ok: true, retryAfter: 0 }
    },
    reset() {
      buckets.clear()
    },
  }
}

/**
 * Extract the best-guess client IP from a request.
 * Falls back to "anon" so the limiter still groups anonymous traffic.
 */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anon"
  )
}
