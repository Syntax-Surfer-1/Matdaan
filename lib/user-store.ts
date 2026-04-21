"use client"

import { useCallback, useEffect, useState } from "react"
import type { JourneyStepId, Lang, UserProfile } from "./types"

const STORAGE_KEY = "matdaan.user.v1"

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as UserProfile
    if (typeof parsed.age !== "number") return null
    // Backfill language for older profiles.
    if (!parsed.language) parsed.language = "en"
    return parsed
  } catch {
    return null
  }
}

export function saveProfile(profile: UserProfile) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function clearProfile() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setProfile(loadProfile())
    setHydrated(true)
  }, [])

  const update = useCallback((next: UserProfile | null) => {
    if (next) saveProfile(next)
    else clearProfile()
    setProfile(next)
  }, [])

  const patch = useCallback((partial: Partial<UserProfile>) => {
    setProfile((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...partial }
      saveProfile(next)
      return next
    })
  }, [])

  const completeStep = useCallback((stepId: JourneyStepId) => {
    setProfile((prev) => {
      if (!prev) return prev
      const nextCompleted = prev.completedSteps.includes(stepId)
        ? prev.completedSteps
        : [...prev.completedSteps, stepId]

      // When the user marks these steps complete, also update the underlying booleans
      // so the computed voter state and banner advance correctly.
      const extras: Partial<UserProfile> = {}
      if (stepId === "registration") extras.isRegistered = true
      if (stepId === "verification") {
        extras.isRegistered = true
        extras.hasVoterId = true
      }

      const next = { ...prev, ...extras, completedSteps: nextCompleted }
      saveProfile(next)
      return next
    })
  }, [])

  const setLanguage = useCallback((lang: Lang) => {
    setProfile((prev) => {
      if (!prev) return prev
      const next = { ...prev, language: lang }
      saveProfile(next)
      return next
    })
  }, [])

  return { profile, setProfile: update, patch, completeStep, setLanguage, hydrated }
}
