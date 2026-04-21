"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Lang } from "./types"
import { DEFAULT_LANG, LANGUAGES, isLang, t as translate } from "./i18n"

/**
 * Single source of truth for the UI language across landing, onboarding, and
 * dashboard. Persists to `localStorage` and keeps the `<html lang>` attribute
 * in sync for assistive technology.
 */

const LANGUAGE_STORAGE_KEY = "matdaan.language.v1"
const PROFILE_STORAGE_KEY = "matdaan.user.v1"

type Translator = (key: string, params?: Record<string, string | number>) => string

type LanguageContextValue = {
  language: Lang
  setLanguage: (lang: Lang) => void
  t: Translator
  languages: typeof LANGUAGES
  hydrated: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readInitialLanguage(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (isLang(stored)) return stored
    // Migrate from an existing profile if present.
    const profile = window.localStorage.getItem(PROFILE_STORAGE_KEY)
    if (profile) {
      const parsed = JSON.parse(profile) as { language?: unknown }
      if (isLang(parsed.language)) return parsed.language
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_LANG
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Lang>(DEFAULT_LANG)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from storage on mount (SSR-safe).
  useEffect(() => {
    setLanguageState(readInitialLanguage())
    setHydrated(true)
  }, [])

  // Persist + mirror on <html lang="">.
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = language
    }
  }, [hydrated, language])

  const setLanguage = useCallback((lang: Lang) => {
    if (!isLang(lang)) return
    setLanguageState(lang)
    // Also keep the user profile (if any) in sync so dashboard components
    // that read `profile.language` immediately reflect the change.
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Record<string, unknown>
      parsed.language = lang
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(parsed))
    } catch {
      /* ignore */
    }
  }, [])

  const t = useCallback<Translator>(
    (key, params) => translate(language, key, params),
    [language],
  )

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t, languages: LANGUAGES, hydrated }),
    [language, setLanguage, t, hydrated],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>")
  }
  return ctx
}
