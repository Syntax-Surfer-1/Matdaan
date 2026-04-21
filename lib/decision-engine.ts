import type { JourneyStepId, Lang, StepStatus, UserProfile, VoterState } from "./types"
import { STATE_META, STEP_TITLES } from "./i18n"

export function getVoterState(profile: Pick<UserProfile, "age" | "isRegistered" | "hasVoterId">): VoterState {
  if (profile.age < 18) return "NOT_ELIGIBLE"
  if (!profile.isRegistered) return "ELIGIBLE_NOT_REGISTERED"
  if (profile.isRegistered && !profile.hasVoterId) return "REGISTERED"
  return "READY_TO_VOTE"
}

export function getJourneySteps(lang: Lang = "en"): {
  id: JourneyStepId
  title: string
  subtitle: string
}[] {
  return (["eligibility", "registration", "verification", "voting"] as JourneyStepId[]).map((id) => ({
    id,
    title: STEP_TITLES[id][lang].title,
    subtitle: STEP_TITLES[id][lang].subtitle,
  }))
}

// Ordered step ids (language-agnostic) — used by progression logic.
export const STEP_ORDER: JourneyStepId[] = ["eligibility", "registration", "verification", "voting"]

export function getStepStatuses(profile: UserProfile): Record<JourneyStepId, StepStatus> {
  const voterState = getVoterState(profile)
  const completed = new Set(profile.completedSteps)

  const statuses: Record<JourneyStepId, StepStatus> = {
    eligibility: "locked",
    registration: "locked",
    verification: "locked",
    voting: "locked",
  }

  if (voterState === "NOT_ELIGIBLE") {
    statuses.eligibility = "current"
    return statuses
  }

  // Eligibility — 18+ can confirm.
  statuses.eligibility = completed.has("eligibility") ? "completed" : "current"

  // Registration unlocks after eligibility is confirmed OR treat as available if age >= 18.
  const eligibilityDone = statuses.eligibility === "completed"
  if (eligibilityDone) {
    const registrationDone = profile.isRegistered || completed.has("registration")
    statuses.registration = registrationDone ? "completed" : "current"
  }

  if (statuses.registration === "completed") {
    const verificationDone = profile.hasVoterId || completed.has("verification")
    statuses.verification = verificationDone ? "completed" : "current"
  }

  if (statuses.verification === "completed") {
    statuses.voting = completed.has("voting") ? "completed" : "current"
  }

  return statuses
}

export function getStateMeta(
  state: VoterState,
  lang: Lang = "en",
): {
  label: string
  headline: string
  description: string
  tone: "muted" | "accent" | "primary" | "success"
} {
  const copy = STATE_META[state][lang] ?? STATE_META[state].en
  const tone = (
    {
      NOT_ELIGIBLE: "muted",
      ELIGIBLE_NOT_REGISTERED: "accent",
      REGISTERED: "primary",
      READY_TO_VOTE: "success",
    } as const
  )[state]
  return { ...copy, tone }
}
