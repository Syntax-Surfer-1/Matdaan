import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"
import { LANGUAGES, isLang } from "@/lib/i18n"
import type { Lang } from "@/lib/types"

/**
 * Chat route — Gemini 2.5 Flash via @ai-sdk/google.
 *
 * Security:
 *  - Zod schema validation for payload shape.
 *  - Per-IP in-memory rate limit (best effort, hardens cold starts).
 *  - Message count + length caps to bound token cost.
 *  - PII redaction for Aadhaar / OTP / long digit strings before model call.
 *  - Generic error messages — never leak stack traces or env details.
 */

export const maxDuration = 30
// AI SDK requires Node runtime (no edge).
export const runtime = "nodejs"

// --- Rate limiter (best-effort, per-instance) --------------------------------

const RATE_LIMIT_MAX = 20 // requests
const RATE_LIMIT_WINDOW_MS = 60_000 // per minute
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>()

function rateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  const bucket = rateLimitBuckets.get(ip)
  if (!bucket || bucket.resetAt < now) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { ok: true, retryAfter: 0 }
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  bucket.count += 1
  return { ok: true, retryAfter: 0 }
}

// Periodically clean up expired buckets (~once per window).
if (typeof globalThis.setInterval === "function") {
  setInterval(() => {
    const now = Date.now()
    for (const [ip, bucket] of rateLimitBuckets) {
      if (bucket.resetAt < now) rateLimitBuckets.delete(ip)
    }
  }, RATE_LIMIT_WINDOW_MS).unref?.()
}

// --- Payload validation -------------------------------------------------------

const MAX_MESSAGES = 40
const MAX_TEXT_LENGTH = 4_000

const partSchema = z.union([
  z.object({ type: z.literal("text"), text: z.string().max(MAX_TEXT_LENGTH) }),
  // Pass-through for any other part types the AI SDK may produce (images, etc.)
  z.object({ type: z.string() }).passthrough(),
])

const messageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(partSchema).max(20),
})

const userContextSchema = z
  .object({
    name: z.string().max(80).optional(),
    age: z.number().int().min(0).max(120).optional(),
    isRegistered: z.boolean().optional(),
    hasVoterId: z.boolean().optional(),
    state: z.string().max(80).optional(),
    voterState: z.string().max(64).optional(),
    language: z.string().optional(),
  })
  .optional()

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
  userContext: userContextSchema,
})

// --- PII redaction ------------------------------------------------------------

/**
 * Best-effort scrubbing — converts 12-digit Aadhaar numbers and 4-8 digit
 * OTP-like strings into placeholders before the message reaches Gemini.
 * We do this on the server so the original text never leaves our process.
 */
function redactPII(text: string): string {
  return text
    .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[redacted:aadhaar]") // 12-digit
    .replace(/\b(?:otp|one[-\s]?time[-\s]?password)[:\s]*\d{4,8}\b/gi, "[redacted:otp]")
    .replace(/\b\d{12,}\b/g, "[redacted:id]") // long unknown id numbers
}

function redactMessage(message: z.infer<typeof messageSchema>) {
  return {
    ...message,
    parts: message.parts.map((part) =>
      "text" in part && typeof part.text === "string"
        ? { ...part, text: redactPII(part.text) }
        : part,
    ),
  }
}

// --- System prompt ------------------------------------------------------------

const BASE_SYSTEM = `You are Matdaan, a calm, factual, and encouraging assistant that helps Indian citizens navigate the election process. Your guidance aligns with the Election Commission of India (ECI) and the National Voter Services Portal (voters.eci.gov.in).

Personality:
- Warm, concise, and respectful. Never political, never partisan.
- Use simple language a first-time voter can understand.
- Mention official resources (NVSP, Form 6, EPIC, Booth Level Officer) where relevant.

Rules:
- Never ask users for Aadhaar numbers, OTPs, passwords, or any sensitive data.
- If a message contains "[redacted:...]", it means we removed PII — gently remind the user they do not need to share it.
- If you don't know a date or constituency-specific detail, say so and point to the ECI website.
- Keep replies under 140 words unless the user asks for more detail.
- Use bullet points for steps. Bold key form names (e.g., **Form 6**).
- Technical terms like EPIC, Form 6, NVSP, VVPAT may stay in English even in other languages.`

// --- Handler ------------------------------------------------------------------

export async function POST(req: Request) {
  // 1) Require API key server-side (never exposed to the client).
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: "Chat is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY." },
      { status: 503 },
    )
  }

  // 2) Rate limit by IP (best-effort).
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anon"
  const { ok, retryAfter } = rateLimit(ip)
  if (!ok) {
    return Response.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    )
  }

  // 3) Validate body shape.
  let parsed: z.infer<typeof bodySchema>
  try {
    const json = await req.json()
    parsed = bodySchema.parse(json)
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 })
  }

  // 4) Resolve language + redact PII.
  const rawLang = parsed.userContext?.language
  const lang: Lang = isLang(rawLang) ? rawLang : "en"
  const langMeta = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0]

  const safeMessages = parsed.messages.map(redactMessage) as UIMessage[]

  // 5) Build the system prompt.
  const languageDirective =
    lang === "en"
      ? "Respond in clear, simple English."
      : `IMPORTANT: Respond entirely in ${langMeta.aiName}. Use the native script. Keep technical terms (EPIC, Form 6, NVSP, VVPAT, Aadhaar) in their standard form.`

  const ctx = parsed.userContext
  const contextSuffix = ctx
    ? `\n\nUser context (for personalization, do not quote verbatim):\n- Name: ${ctx.name ?? "(not provided)"}\n- Age: ${ctx.age ?? "(unknown)"}\n- Registered: ${ctx.isRegistered ? "Yes" : "No"}\n- Has EPIC: ${ctx.hasVoterId ? "Yes" : "No"}\n- State: ${ctx.state ?? "(unknown)"}\n- Status: ${ctx.voterState ?? "(unknown)"}`
    : ""

  try {
    const google = createGoogleGenerativeAI({ apiKey })

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: `${BASE_SYSTEM}\n\n${languageDirective}${contextSuffix}`,
      messages: await convertToModelMessages(safeMessages),
    })

    return result.toUIMessageStreamResponse()
  } catch (err) {
    console.error("[v0] chat route error:", err)
    // Never leak details to clients.
    return Response.json(
      { error: "The assistant is temporarily unavailable. Please try again." },
      { status: 502 },
    )
  }
}
