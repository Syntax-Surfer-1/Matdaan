import { describe, expect, it } from "vitest"
import {
  getVoterState,
  getStepStatuses,
  getStateMeta,
  STEP_ORDER,
} from "@/lib/decision-engine"
import type { UserProfile } from "@/lib/types"

const baseProfile: UserProfile = {
  name: "Aarav",
  age: 22,
  isRegistered: false,
  hasVoterId: false,
  state: "Gujarat",
  completedSteps: [],
  language: "en",
  createdAt: 0,
}

describe("getVoterState", () => {
  it("returns NOT_ELIGIBLE when under 18", () => {
    expect(getVoterState({ ...baseProfile, age: 17 })).toBe("NOT_ELIGIBLE")
  })

  it("returns ELIGIBLE_NOT_REGISTERED when 18+ and not registered", () => {
    expect(getVoterState(baseProfile)).toBe("ELIGIBLE_NOT_REGISTERED")
  })

  it("returns REGISTERED when registered without EPIC", () => {
    expect(getVoterState({ ...baseProfile, isRegistered: true })).toBe("REGISTERED")
  })

  it("returns READY_TO_VOTE when registered and has EPIC", () => {
    expect(
      getVoterState({ ...baseProfile, isRegistered: true, hasVoterId: true }),
    ).toBe("READY_TO_VOTE")
  })
})

describe("getStepStatuses", () => {
  it("locks all subsequent steps for NOT_ELIGIBLE users", () => {
    const statuses = getStepStatuses({ ...baseProfile, age: 16 })
    expect(statuses.eligibility).toBe("current")
    expect(statuses.registration).toBe("locked")
    expect(statuses.verification).toBe("locked")
    expect(statuses.voting).toBe("locked")
  })

  it("advances to registration after eligibility is confirmed", () => {
    const statuses = getStepStatuses({
      ...baseProfile,
      completedSteps: ["eligibility"],
    })
    expect(statuses.eligibility).toBe("completed")
    expect(statuses.registration).toBe("current")
    expect(statuses.verification).toBe("locked")
  })

  it("honors completedSteps for registration even if profile.isRegistered is false", () => {
    const statuses = getStepStatuses({
      ...baseProfile,
      completedSteps: ["eligibility", "registration"],
    })
    expect(statuses.registration).toBe("completed")
    expect(statuses.verification).toBe("current")
  })

  it("marks voting as current once all prior steps are done", () => {
    const statuses = getStepStatuses({
      ...baseProfile,
      isRegistered: true,
      hasVoterId: true,
      completedSteps: ["eligibility", "registration", "verification"],
    })
    expect(statuses.voting).toBe("current")
  })

  it("marks all steps completed when the entire journey is done", () => {
    const statuses = getStepStatuses({
      ...baseProfile,
      isRegistered: true,
      hasVoterId: true,
      completedSteps: ["eligibility", "registration", "verification", "voting"],
    })
    for (const id of STEP_ORDER) {
      expect(statuses[id]).toBe("completed")
    }
  })
})

describe("getStateMeta", () => {
  it("returns localized banner copy", () => {
    const en = getStateMeta("ELIGIBLE_NOT_REGISTERED", "en")
    const gu = getStateMeta("ELIGIBLE_NOT_REGISTERED", "gu")
    expect(en.label).toBeTruthy()
    expect(gu.label).toBeTruthy()
    expect(en.label).not.toBe(gu.label)
    expect(en.tone).toBe("accent")
  })

  it("falls back gracefully if locale is missing (unreachable under types but checked)", () => {
    // @ts-expect-error — pass an unknown lang to assert defensive fallback
    const meta = getStateMeta("READY_TO_VOTE", "xx")
    expect(meta.label).toBeTruthy()
    expect(meta.tone).toBe("success")
  })
})
