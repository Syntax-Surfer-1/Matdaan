import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"
import { LANGUAGES, isLang } from "@/lib/i18n"
import { createRateLimiter, getClientIp } from "@/lib/security"

/**
 * POST /api/translate
 *
 * AI-powered translation fallback, used when a localized string is missing
 * from the static dictionary. Translates short UI copy via Gemini 2.5 Flash
 * and returns a plain-text response.
 *
 * Google Services used:
 *  - Gemini 2.5 Flash for zero-shot, context-aware translation.
 *
 * Security:
 *  - Strict zod validation (small payload, supported language codes only).
 *  - Per-IP rate limit (30 req / minute) — tighter than chat because each
 *    translation is a short one-shot call.
 *  - No stack traces in responses.
 */

export const runtime = "nodejs"
export const maxDuration = 15

// Keep cache semantics explicit — avoids accidental route-level caching.
export const dynamic = "force-dynamic"

const limiter = createRateLimiter(30, 60_000)

export const translateBodySchema = z.object({
  text: z.string().min(1).max(2_000),
  to: z.string().refine(isLang, { message: "Unsupported language" }),
  // Short context keeps the model grounded in UI wording.
  context: z.string().max(200).optional(),
})

export type TranslateRequestBody = z.infer<typeof translateBodySchema>

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return Response.json({ error: "Translation is not configured." }, { status: 503 })
  }

  const { ok, retryAfter } = limiter.check(getClientIp(req))
  if (!ok) {
    return Response.json(
      { error: "Too many translation requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    )
  }

  let parsed: TranslateRequestBody
  try {
    parsed = translateBodySchema.parse(await req.json())
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 })
  }

  const targetLang = LANGUAGES.find((l) => l.code === parsed.to)
  if (!targetLang) {
    return Response.json({ error: "Unsupported language." }, { status: 400 })
  }

  try {
    const google = createGoogleGenerativeAI({ apiKey })
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      temperature: 0.2,
      system: `You translate short UI copy from English into ${targetLang.aiName}. Output only the translation in the native script — no quotes, no explanations. Preserve numbers, dates, emoji, brand names, and technical voter-process terms (EPIC, Form 6, NVSP, VVPAT, Aadhaar) in their original form.`,
      prompt: parsed.context
        ? `Context: ${parsed.context}\n\nTranslate this text: ${parsed.text}`
        : `Translate: ${parsed.text}`,
    })

    return Response.json(
      { translated: text.trim(), language: targetLang.code },
      {
        // Short edge-cache tolerance — same input → same output.
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    )
  } catch (err) {
    console.error("[v0] translate route error:", err)
    return Response.json(
      { error: "Translation is temporarily unavailable." },
      { status: 502 },
    )
  }
}
