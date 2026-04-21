import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"
import { LANGUAGES, isLang } from "@/lib/i18n"
import type { Lang } from "@/lib/types"
import { createRateLimiter, getClientIp, redactPII } from "@/lib/security"

/**
 * Chat route — Gemini 2.5 Flash via @ai-sdk/google with Google Search grounding.
 *
 * Google Services used:
 *  - Gemini 2.5 Flash (reasoning / generation)
 *  - Google Search tool (real-time grounded answers — tool name MUST be `google_search`)
 *
 * Security:
 *  - Zod validation for payload shape
 *  - Per-IP in-memory rate limit (extracted to lib/security.ts for tests)
 *  - Message count + length caps to bound token cost
 *  - PII redaction for Aadhaar / OTP / long digit strings before the model call
 *  - Generic error responses — never leak stack traces or env details
 */

export const maxDuration = 30
// AI SDK requires the Node runtime (no edge).
export const runtime = "nodejs"

// Single shared limiter per process / lambda instance.
const limiter = createRateLimiter(20, 60_000)

// --- Payload validation -------------------------------------------------------

const MAX_MESSAGES = 40
const MAX_TEXT_LENGTH = 4_000

const partSchema = z.union([
  z.object({ type: z.literal("text"), text: z.string().max(MAX_TEXT_LENGTH) }),
  // Forward-compat for non-text parts (images, tool calls) produced by the AI SDK.
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

export const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
  userContext: userContextSchema,
})

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

Tool use:
- You have access to Google Search via the \`google_search\` tool. Use it ONLY when the user asks about time-sensitive or constituency-specific facts (current election dates, Model Code of Conduct announcements, polling booth addresses, candidate lists, ECI press notes). For evergreen "how to" questions, rely on your own knowledge — no need to search.
- When you ground an answer with search, cite the source domain inline (e.g. "per eci.gov.in").

Rules:
- Never ask users for Aadhaar numbers, OTPs, passwords, or any sensitive data.
- If a message contains "[redacted:...]", it means we removed PII — gently remind the user they do not need to share it.
- If you don't know a date or constituency-specific detail even after searching, say so and point to voters.eci.gov.in.
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

  // 2) Rate limit by IP.
  const { ok, retryAfter } = limiter.check(getClientIp(req))
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
      // Google Search grounding — real-time web evidence via Google's index.
      tools: {
        google_search: google.tools.googleSearch({}),
      },
      stopWhen: stepCountIs(4),
    })

    return result.toUIMessageStreamResponse()
  } catch (err) {
    console.error("[v0] chat route error:", err)
    return Response.json(
      { error: "The assistant is temporarily unavailable. Please try again." },
      { status: 502 },
    )
  }
}
