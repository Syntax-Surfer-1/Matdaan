"use client"

import { motion } from "framer-motion"
import { CircleCheck, Clock, Sparkles, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserProfile, VoterState } from "@/lib/types"
import { getStateMeta } from "@/lib/decision-engine"
import { t } from "@/lib/i18n"

const TONE_STYLES: Record<
  ReturnType<typeof getStateMeta>["tone"],
  {
    container: string
    pill: string
    Icon: typeof CircleCheck
  }
> = {
  muted: {
    container: "bg-muted text-foreground",
    pill: "border-border bg-background/70 text-muted-foreground",
    Icon: Clock,
  },
  accent: {
    container: "bg-gradient-to-br from-accent/25 via-accent/10 to-transparent",
    pill: "border-accent/40 bg-accent/20 text-accent-foreground",
    Icon: TriangleAlert,
  },
  primary: {
    container: "bg-primary text-primary-foreground",
    pill: "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground",
    Icon: Sparkles,
  },
  success: {
    container: "bg-gradient-to-br from-accent/35 via-primary/10 to-transparent",
    pill: "border-primary/30 bg-primary/10 text-primary",
    Icon: CircleCheck,
  },
}

export function StatusBanner({
  profile,
  voterState,
}: {
  profile: UserProfile
  voterState: VoterState
}) {
  const lang = profile.language ?? "en"
  const meta = getStateMeta(voterState, lang)
  const tone = TONE_STYLES[meta.tone]
  const Icon = tone.Icon
  const firstName = profile.name.split(" ")[0]

  const completed = new Set(profile.completedSteps)
  const steps = [
    profile.age >= 18 || completed.has("eligibility"),
    profile.isRegistered || completed.has("registration"),
    profile.hasVoterId || completed.has("verification"),
    completed.has("voting"),
  ]
  const done = steps.filter(Boolean).length
  const progressPct = Math.round((done / steps.length) * 100)

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border p-8 sm:p-10",
        tone.container,
      )}
    >
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
              tone.pill,
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            <span>{meta.label}</span>
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] opacity-70">
            {t(lang, "dashboard.hello")}, {firstName}
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-[1.1] tracking-tight text-balance sm:text-5xl">
            {meta.headline}
          </h1>
          <p className="mt-4 max-w-lg text-pretty leading-relaxed opacity-80">
            {meta.description}
          </p>
        </div>

        <div className="w-full max-w-sm lg:w-80">
          <div className="flex items-baseline justify-between">
            <p className="text-xs uppercase tracking-[0.2em] opacity-70">
              {t(lang, "dashboard.overallProgress")}
            </p>
            <p className="font-mono text-xs opacity-80">
              {done} / {steps.length}
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/30">
            <motion.div
              className="h-full rounded-full bg-foreground"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-foreground/10 pt-5 text-xs">
            <div>
              <dt className="opacity-70">{t(lang, "dashboard.ageOf")}</dt>
              <dd className="mt-1 font-serif text-2xl">{profile.age}</dd>
            </div>
            <div>
              <dt className="opacity-70">{t(lang, "dashboard.state")}</dt>
              <dd className="mt-1 truncate text-sm font-medium">{profile.state}</dd>
            </div>
            <div>
              <dt className="opacity-70">{t(lang, "dashboard.epic")}</dt>
              <dd className="mt-1 text-sm font-medium">
                {profile.hasVoterId || completed.has("verification")
                  ? t(lang, "dashboard.epic.issued")
                  : t(lang, "dashboard.epic.pending")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </motion.section>
  )
}
