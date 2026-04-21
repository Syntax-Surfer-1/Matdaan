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

  it("exposes Google Maps polling-finder copy in English", () => {
    expect(t("en", "polling.title").length).toBeGreaterThan(0)
    expect(t("en", "polling.openMaps").toLowerCase()).toContain("google")
  })

  it("delivers a non-empty Gujarati string for core dashboard copy", () => {
    const guTitle = t("gu", "dashboard.welcome")
    expect(guTitle.length).toBeGreaterThan(0)
    // Gujarati should not be plain ASCII — detect at least one non-ASCII char.
    expect(/[^\x00-\x7F]/.test(guTitle)).toBe(true)
  })
})

describe("translation coverage", () => {
  // A small sample of critical user-facing keys that MUST be translated in
  // every non-English language. This prevents accidental fallbacks shipping.
  const criticalKeys = [
    "nav.features",
    "hero.cta.start",
    "dashboard.welcome",
    "chat.heading",
    "guide.markComplete",
  ]

  for (const lang of LANGUAGES.filter((l) => l.code !== "en")) {
    it(`${lang.code} translates all critical UI copy`, () => {
      for (const key of criticalKeys) {
        const translated = t(lang.code, key)
        const english = t("en", key)
        // Every critical key must exist.
        expect(translated).toBeTruthy()
        // And must be genuinely localized (differ from English).
        expect(translated).not.toBe(english)
      }
    })
  }
})
