import { NextResponse, type NextRequest } from "next/server"

/**
 * Security + observability middleware.
 *
 * Applies a set of hardening headers to every response:
 *  - Content-Security-Policy (CSP) locks down script/style/frame origins.
 *  - Strict-Transport-Security enforces HTTPS (only honored on https).
 *  - X-Frame-Options / frame-ancestors blocks clickjacking.
 *  - Referrer-Policy caps outbound referrer leakage.
 *  - Permissions-Policy disables sensors the app never needs.
 *  - X-Content-Type-Options blocks MIME sniffing.
 *
 * We allow `frame-src https://www.google.com` so the Google Maps Embed in
 * the Polling Station Finder continues to work. Script sources are limited
 * to our own origin plus Vercel Analytics.
 */

const CSP_DIRECTIVES: Record<string, string[]> = {
  "default-src": ["'self'"],
  // Next.js + React need 'unsafe-inline' for runtime style injection; this is
  // the recommended practice for app router until nonce support lands.
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://va.vercel-scripts.com"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
  "connect-src": ["'self'", "https://va.vercel-scripts.com", "https://vitals.vercel-insights.com"],
  "frame-src": ["'self'", "https://www.google.com", "https://maps.google.com"],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "object-src": ["'none'"],
}

function buildCsp(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([k, v]) => `${k} ${v.join(" ")}`)
    .join("; ")
}

export function middleware(_req: NextRequest) {
  const res = NextResponse.next()
  const headers = res.headers

  headers.set("Content-Security-Policy", buildCsp())
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  headers.set("X-Frame-Options", "DENY")
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  )

  return res
}

export const config = {
  // Skip static assets; apply to everything else including API routes.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)).*)"],
}
