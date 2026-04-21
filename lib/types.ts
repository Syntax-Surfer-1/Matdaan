export type VoterState =
  | "NOT_ELIGIBLE"
  | "ELIGIBLE_NOT_REGISTERED"
  | "REGISTERED"
  | "READY_TO_VOTE"

export type JourneyStepId = "eligibility" | "registration" | "verification" | "voting"

export type StepStatus = "locked" | "available" | "current" | "completed"

/** Supported UI languages (ISO 639-1 codes). Includes major Indian languages. */
export type Lang = "en" | "hi" | "mr" | "ta" | "te" | "bn" | "gu"

export interface UserProfile {
  name: string
  age: number
  isRegistered: boolean
  hasVoterId: boolean
  state: string // Indian state, e.g. "Maharashtra"
  completedSteps: JourneyStepId[]
  language: Lang
  celebrationSeen?: boolean
  createdAt: number
}
