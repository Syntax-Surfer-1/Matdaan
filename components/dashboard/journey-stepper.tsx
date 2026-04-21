"use client"

import { Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { JourneyStepId, StepStatus, UserProfile } from "@/lib/types"
import { getJourneySteps } from "@/lib/decision-engine"
import { t } from "@/lib/i18n"

export function JourneyStepper({
  statuses,
  profile,
}: {
  statuses: Record<JourneyStepId, StepStatus>
  profile: UserProfile
}) {
  const lang = profile.language ?? "en"
  const steps = getJourneySteps(lang)

  return (
    <section
      aria-label="Journey progress"
      className="rounded-2xl border border-border bg-card p-6 sm:p-7"
    >
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {t(lang, "journey.eyebrow")}
          </p>
          <h2 className="mt-1 font-serif text-2xl tracking-tight">
            {t(lang, "journey.title")}
          </h2>
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">
          {t(lang, "journey.voterIn")} {profile.state}
        </p>
      </div>

      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => {
          const status = statuses[step.id]
          return (
            <li key={step.id}>
              <StepNode index={i + 1} step={step} status={status} lang={lang} />
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function StepNode({
  index,
  step,
  status,
  lang,
}: {
  index: number
  step: { id: JourneyStepId; title: string; subtitle: string }
  status: StepStatus
  lang: UserProfile["language"]
}) {
  const isDone = status === "completed"
  const isCurrent = status === "current"
  const isLocked = status === "locked"

  const statusLabel = isDone
    ? t(lang, "journey.status.completed")
    : isCurrent
      ? t(lang, "journey.status.current")
      : isLocked
        ? t(lang, "journey.status.locked")
        : t(lang, "journey.status.ready")

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-3 rounded-xl border p-4 transition-all",
        isDone && "border-primary/30 bg-secondary/70",
        isCurrent && "border-accent/50 bg-accent/10 shadow-sm",
        isLocked && "border-dashed border-border/60 bg-background opacity-70",
        !isDone && !isCurrent && !isLocked && "border-border bg-background",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono",
            isDone && "bg-primary text-primary-foreground",
            isCurrent && "bg-accent text-accent-foreground",
            isLocked && "bg-muted text-muted-foreground",
            !isDone && !isCurrent && !isLocked && "bg-secondary text-foreground",
          )}
        >
          {isDone ? (
            <Check className="h-3.5 w-3.5" />
          ) : isLocked ? (
            <Lock className="h-3 w-3" />
          ) : (
            String(index).padStart(2, "0")
          )}
        </span>
        <span
          className={cn(
            "text-[10px] uppercase tracking-[0.18em]",
            isCurrent ? "text-accent-foreground/80" : "text-muted-foreground",
          )}
        >
          {statusLabel}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-serif text-lg leading-tight tracking-tight">{step.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {step.subtitle}
        </p>
      </div>
    </div>
  )
}
