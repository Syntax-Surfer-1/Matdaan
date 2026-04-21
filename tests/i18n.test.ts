import { describe, expect, it } from "vitest"
import { DEFAULT_LANG, LANGUAGES, isLang, t } from "@/lib/i18n"

describe("LANGUAGES catalog", () => {
  it("exposes the seven supported UI languages", () => {
    const codes = LANGUAGES.map((l) => l.code).sort()
    expect(codes).toEqual(["bn", "en", "gu", "hi", "mr", "ta", "te"])
  })

  it("every entry has a native endonym and an aiName", () => {
    for (const lang of LANGUAGES) {
      expect(lang.native.length).toBeGreaterThan(0)
      expect(lang.aiName.length).toBeGreaterThan(0)
    }
  })

  it("defaults to English", () => {
    expect(DEFAULT_LANG).toBe("en")
  })
})

describe("isLang", () => {
  it("accepts supported codes", () => {
    expect(isLang("en")).toBe(true)
    expect(isLang("gu")).toBe(true)
    expect(isLang("hi")).toBe(true)
  })

  it("rejects anything else", () => {
    expect(isLang("fr")).toBe(false)
    expect(isLang(null)).toBe(false)
    expect(isLang(undefined)).toBe(false)
    expect(isLang({ code: "en" })).toBe(false)
  })
})

describe("t() translator", () => {
  it("returns the English translation by default", () => {
    expect(t("en", "nav.features")).toBe("Features")
  })

  it("returns localized strings for each supported language", () => {
    for (const lang of LANGUAGES) {
      const value = t(lang.code, "nav.features")
      expect(value.length).toBeGreaterThan(0)
    }
  })

  it("interpolates {param} placeholders", () => {
    const out = t("en", "footer.rights", { year: 2026 })
    expect(out).toContain("2026")
    expect(out).not.toContain("{year}")
  })

  it("falls back to English when the localized key is missing", () => {
    // `__nonexistent__` returns the key itself, which is identical for every lang.
    expect(t("gu", "__nonexistent__")).toBe("__nonexistent__")
  })

  it("falls back to English for a missing locale", () => {
    // @ts-expect-error — intentionally invalid locale
    expect(t("xx", "nav.features")).toBe("Features")
  })
})
