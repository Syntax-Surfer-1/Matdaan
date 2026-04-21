import { describe, it, expect } from "vitest"
import { redactPII, createRateLimiter, getClientIp } from "@/lib/security"

describe("redactPII", () => {
  it("redacts bare 12-digit Aadhaar numbers", () => {
    expect(redactPII("My Aadhaar is 1234 5678 9012, please")).toContain("[redacted:aadhaar]")
  })

  it("redacts hyphenated Aadhaar formats", () => {
    expect(redactPII("1234-5678-9012")).toBe("[redacted:aadhaar]")
  })

  it("redacts OTP-labeled digits", () => {
    expect(redactPII("the otp is 123456")).toContain("[redacted:otp]")
    expect(redactPII("one-time password: 98765")).toContain("[redacted:otp]")
  })

  it("redacts long digit strings as generic IDs", () => {
    expect(redactPII("id 123456789012345 here")).toContain("[redacted:id]")
  })

  it("leaves innocuous numbers alone", () => {
    expect(redactPII("I am 18 years old and live in Pune 411001")).toBe(
      "I am 18 years old and live in Pune 411001",
    )
  })

  it("handles non-string / empty input gracefully", () => {
    expect(redactPII("")).toBe("")
    // @ts-expect-error — runtime guard path
    expect(redactPII(null)).toBe(null)
  })
})

describe("createRateLimiter", () => {
  it("permits traffic under the limit", () => {
    const limiter = createRateLimiter(3, 1000)
    expect(limiter.check("ip-a").ok).toBe(true)
    expect(limiter.check("ip-a").ok).toBe(true)
    expect(limiter.check("ip-a").ok).toBe(true)
  })

  it("blocks traffic above the limit with Retry-After > 0", () => {
    const limiter = createRateLimiter(2, 1000)
    limiter.check("ip-b")
    limiter.check("ip-b")
    const blocked = limiter.check("ip-b")
    expect(blocked.ok).toBe(false)
    expect(blocked.retryAfter).toBeGreaterThan(0)
  })

  it("isolates buckets by key", () => {
    const limiter = createRateLimiter(1, 1000)
    expect(limiter.check("ip-c").ok).toBe(true)
    expect(limiter.check("ip-c").ok).toBe(false)
    expect(limiter.check("ip-d").ok).toBe(true)
  })

  it("can be reset for test isolation", () => {
    const limiter = createRateLimiter(1, 1000)
    limiter.check("ip-e")
    expect(limiter.check("ip-e").ok).toBe(false)
    limiter.reset()
    expect(limiter.check("ip-e").ok).toBe(true)
  })
})

describe("getClientIp", () => {
  const makeReq = (headers: Record<string, string>): Request =>
    new Request("https://example.com", { headers })

  it("prefers the first x-forwarded-for entry", () => {
    const req = makeReq({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" })
    expect(getClientIp(req)).toBe("203.0.113.9")
  })

  it("falls back to x-real-ip", () => {
    const req = makeReq({ "x-real-ip": "198.51.100.4" })
    expect(getClientIp(req)).toBe("198.51.100.4")
  })

  it("returns 'anon' when no headers present", () => {
    const req = makeReq({})
    expect(getClientIp(req)).toBe("anon")
  })
})
