"use client"

import { CalendarDays, CheckCircle2, Megaphone, Trophy, Vote } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserProfile } from "@/lib/types"
import { t } from "@/lib/i18n"

type Phase = {
  id: string
  icon: typeof CalendarDays
  label: string
  window: string
  description: string
  state: "past" | "active" | "upcoming"
}

const PHASES: Phase[] = [
  {
    id: "rolls",
    icon: CalendarDays,
    label: "Electoral roll revision",
    window: "October — December",
    description: "Summary revision opens for Form 6 submissions across all states.",
    state: "past",
  },
  {
    id: "campaign",
    icon: Megaphone,
    label: "Campaign & model code",
    window: "Announcement → 48 hrs before poll",
    description: "Model Code of Conduct in force. Political campaigning is active.",
    state: "active",
  },
  {
    id: "polling",
    icon: Vote,
    label: "Polling day",
    window: "Phase-wise schedule",
    description: "Your polling station opens 7:00 AM to 6:00 PM in most constituencies.",
    state: "upcoming",
  },
  {
    id: "results",
    icon: Trophy,
    label: "Counting & results",
    window: "Counting day (announced by ECI)",
    description: "EVM counts are consolidated booth-by-booth. Results live on eci.gov.in.",
    state: "upcoming",
  },
]

export function ElectionTimeline({ profile }: { profile: UserProfile }) {
  const lang = profile.language ?? "en"
  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {t(lang, "timeline.eyebrow")}
          </p>
          <h2 className="mt-1 font-serif text-2xl tracking-tight">
            {t(lang, "timeline.title")}
          </h2>
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">Illustrative · ECI</p>
      </div>

      <ol className="mt-6 space-y-3">
        {PHASES.map((phase) => (
          <PhaseRow key={phase.id} phase={phase} lang={lang} />
        ))}
      </ol>
    </section>
  )
}

function PhaseRow({ phase, lang }: { phase: Phase; lang: UserProfile["language"] }) {
  const Icon = phase.icon
  const isActive = phase.state === "active"
  const isPast = phase.state === "past"

  const stateLabel =
    phase.state === "past"
      ? t(lang, "timeline.past")
      : phase.state === "active"
        ? t(lang, "timeline.active")
        : t(lang, "timeline.upcoming")

  return (
    <li
      className={cn(
        "flex items-start gap-4 rounded-xl border p-4 transition-colors",
        isActive && "border-accent/50 bg-accent/10",
        isPast && "border-border/60 bg-background",
        !isActive && !isPast && "border-dashed border-border/60 bg-background",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 flex-none items-center justify-center rounded-lg",
          isActive && "bg-accent text-accent-foreground",
          isPast && "bg-secondary text-foreground",
          !isActive && !isPast && "bg-muted text-muted-foreground",
        )}
      >
        {isPast ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </span>
      <div className="flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-serif text-lg leading-snug tracking-tight">{phase.label}</h3>
          <span
            className={cn(
              "text-[11px] uppercase tracking-[0.18em]",
              isActive ? "text-accent-foreground/80" : "text-muted-foreground",
            )}
          >
            {stateLabel}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{phase.window}</span> — {phase.description}
        </p>
      </div>
    </li>
  )
}
