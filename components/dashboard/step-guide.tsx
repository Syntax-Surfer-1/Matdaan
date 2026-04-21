"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Check, CircleCheck, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { JourneyStepId, Lang, StepStatus, UserProfile } from "@/lib/types"
import { getJourneySteps, STEP_ORDER } from "@/lib/decision-engine"
import { t } from "@/lib/i18n"

type GuideContent = {
  summary: string
  checklist: { label: string; hint?: string }[]
  resources: { label: string; href: string }[]
  actionLabel: string
  actionHref?: string
}

function contentFor(id: JourneyStepId, profile: UserProfile, lang: Lang): GuideContent {
  // For now, detailed checklists stay in English + technical terms; summary uses native language basics.
  switch (id) {
    case "eligibility":
      return {
        summary:
          profile.age >= 18
            ? `At ${profile.age}, you meet the constitutional age requirement (Article 326). You are eligible to be enrolled in the electoral roll of ${profile.state}.`
            : `You are ${profile.age}. You'll be eligible once you turn 18 on the qualifying date (Jan 1 of the year). We'll keep this step open and notify you when you can pre-enroll.`,
        checklist: [
          { label: "You are an Indian citizen", hint: "Article 326 of the Constitution" },
          { label: "You are 18 or older on the qualifying date" },
          { label: "You are a resident of your constituency" },
          { label: "You are not disqualified under any law" },
        ],
        resources: [{ label: "ECI eligibility criteria", href: "https://eci.gov.in/voter/voter" }],
        actionLabel: "Mark eligibility confirmed",
      }
    case "registration":
      return {
        summary:
          "File Form 6 on the National Voter Services Portal (NVSP). Upload a passport-sized photo, ID proof, and address proof. Processing typically takes 2–4 weeks.",
        checklist: [
          { label: "Aadhaar or valid photo ID (PAN, Driving License)" },
          { label: "Address proof matching your constituency" },
          { label: "Recent passport-sized photograph (JPG, <2 MB)" },
          { label: "Active mobile number for OTP" },
        ],
        resources: [
          { label: "Start Form 6 on NVSP", href: "https://voters.eci.gov.in/signup" },
          { label: "Form 6 guide (PDF)", href: "https://eci.gov.in/files/file/9469-form-6/" },
        ],
        actionLabel: "Open Form 6",
        actionHref: "https://voters.eci.gov.in/signup",
      }
    case "verification":
      return {
        summary:
          "Search the electoral roll for your name and download your digital EPIC (e-EPIC) from the NVSP. Verify every spelling carefully — your EPIC is your proof of identity at the booth.",
        checklist: [
          { label: "Search your name in the electoral roll" },
          { label: "Cross-check your EPIC number and booth address" },
          { label: "Download your e-EPIC PDF" },
          { label: "Flag any errors using Form 8 (correction)" },
        ],
        resources: [
          { label: "Search electoral roll", href: "https://electoralsearch.eci.gov.in/" },
          { label: "Download e-EPIC", href: "https://voters.eci.gov.in/download-epic" },
        ],
        actionLabel: "Mark verification done",
      }
    case "voting":
      return {
        summary:
          "On polling day, carry your EPIC (or an approved alternate ID) to your assigned booth. Arrive early, vote with confidence, and get your indelible-ink mark.",
        checklist: [
          { label: "Carry EPIC or an approved ID (passport, Aadhaar, etc.)" },
          { label: "Know your polling station address" },
          { label: "Avoid phones inside the booth" },
          { label: "Verify the VVPAT slip after casting your vote" },
        ],
        resources: [
          { label: "Find your polling station", href: "https://electoralsearch.eci.gov.in/" },
          {
            label: "Approved alternate IDs",
            href: "https://eci.gov.in/faqs/voting-polling/voting-polling-r1/",
          },
        ],
        actionLabel: "Mark voting day completed",
      }
  }
}

export function StepGuide({
  profile,
  statuses,
  onComplete,
}: {
  profile: UserProfile
  statuses: Record<JourneyStepId, StepStatus>
  onComplete: (id: JourneyStepId) => void
}) {
  const lang = profile.language ?? "en"
  const steps = useMemo(() => getJourneySteps(lang), [lang])

  // Compute the step that should be shown — current > first incomplete > last.
  const computedCurrent = useMemo<JourneyStepId>(() => {
    const current = STEP_ORDER.find((id) => statuses[id] === "current")
    if (current) return current
    const firstIncomplete = STEP_ORDER.find((id) => statuses[id] !== "completed")
    return firstIncomplete ?? STEP_ORDER[STEP_ORDER.length - 1]
  }, [statuses])

  const [active, setActive] = useState<JourneyStepId>(computedCurrent)
  const userPickedRef = useRef(false)

  // Auto-advance when the statuses change (e.g. after Mark complete) — unless
  // the user manually selected a tab and is still viewing a valid one.
  useEffect(() => {
    if (userPickedRef.current && statuses[active] !== "completed") return
    if (active !== computedCurrent) setActive(computedCurrent)
    userPickedRef.current = false
  }, [computedCurrent, statuses, active])

  const activeStep = steps.find((s) => s.id === active)!
  const activeStatus = statuses[active]
  const guide = contentFor(active, profile, lang)

  const statusLabel =
    activeStatus === "completed"
      ? t(lang, "journey.status.completed")
      : activeStatus === "current"
        ? t(lang, "guide.inProgress")
        : activeStatus === "locked"
          ? t(lang, "journey.status.locked")
          : t(lang, "guide.available")

  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-1 border-b border-border/60 p-1.5">
        {steps.map((step) => {
          const s = statuses[step.id]
          const isActive = active === step.id
          return (
            <button
              key={step.id}
              onClick={() => {
                userPickedRef.current = true
                setActive(step.id)
              }}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono",
                  s === "completed" && "bg-primary text-primary-foreground",
                  s === "current" && "bg-accent text-accent-foreground",
                  s === "locked" && "bg-muted text-muted-foreground",
                )}
              >
                {s === "completed" ? <Check className="h-3 w-3" /> : ""}
              </span>
              <span className="truncate">{step.title}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active + lang}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t(lang, "guide.step")} {STEP_ORDER.indexOf(active) + 1} · {statusLabel}
              </p>
              <h3 className="mt-2 font-serif text-3xl tracking-tight">{activeStep.title}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                {guide.summary}
              </p>
            </div>

            {activeStatus === "completed" ? (
              <span className="flex items-center gap-2 rounded-full border border-primary/30 bg-secondary px-3 py-1.5 text-xs font-medium text-primary">
                <CircleCheck className="h-3.5 w-3.5" />
                {t(lang, "guide.completedPill")}
              </span>
            ) : null}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t(lang, "guide.checklist")}
              </h4>
              <ul className="mt-3 space-y-2.5">
                {guide.checklist.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-start gap-3 rounded-lg border border-border/60 bg-background p-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-border bg-card">
                      <Check className="h-3 w-3 text-muted-foreground" />
                    </span>
                    <div>
                      <p className="text-sm">{item.label}</p>
                      {item.hint ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.hint}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t(lang, "guide.resources")}
              </h4>
              <ul className="mt-3 space-y-2">
                {guide.resources.map((r) => (
                  <li key={r.href}>
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background p-3 text-sm transition-colors hover:border-accent/40 hover:bg-accent/10"
                    >
                      <span className="truncate">{r.label}</span>
                      <ExternalLink className="h-3.5 w-3.5 flex-none text-muted-foreground" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
            {guide.actionHref ? (
              <Button asChild className="rounded-full">
                <a href={guide.actionHref} target="_blank" rel="noreferrer">
                  {guide.actionLabel}
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            ) : null}

            {activeStatus !== "completed" && activeStatus !== "locked" ? (
              <Button
                variant={guide.actionHref ? "outline" : "default"}
                onClick={() => {
                  onComplete(active)
                  userPickedRef.current = false
                  toast.success(t(lang, "guide.toast.title"), {
                    description: activeStep.title,
                  })
                }}
                className="rounded-full"
              >
                <Check className="mr-1 h-4 w-4" />
                {t(lang, "guide.markComplete")}
              </Button>
            ) : null}

            {activeStatus === "locked" ? (
              <p className="text-sm text-muted-foreground">{t(lang, "guide.lockedHint")}</p>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
