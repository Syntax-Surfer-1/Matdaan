"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Vote, Settings2, LogOut, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUserProfile } from "@/lib/user-store"
import { getStepStatuses, getVoterState } from "@/lib/decision-engine"
import { t } from "@/lib/i18n"
import { useLanguage } from "@/lib/language-context"
import type { Lang } from "@/lib/types"
import { StatusBanner } from "./status-banner"
import { JourneyStepper } from "./journey-stepper"
import { StepGuide } from "./step-guide"
import { ElectionTimeline } from "./election-timeline"
import { ChatPanel } from "./chat-panel"
import { EmptyState } from "./empty-state"
import { LanguageSwitcher } from "./language-switcher"
import { CelebrationOverlay } from "./celebration-overlay"

export function DashboardShell() {
  const router = useRouter()
  const { profile, setProfile, patch, completeStep, setLanguage, hydrated } = useUserProfile()
  const { setLanguage: setProviderLanguage, language: providerLanguage } = useLanguage()
  const [showCelebration, setShowCelebration] = useState(false)

  // Keep the profile language and the global LanguageProvider in sync both ways:
  // when a user's profile loads for the first time, adopt its language; when
  // they change it here, mirror to the provider so landing pages also update.
  useEffect(() => {
    if (profile?.language && profile.language !== providerLanguage) {
      setProviderLanguage(profile.language)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.language])

  const handleLanguageChange = (lang: Lang) => {
    setLanguage(lang)
    setProviderLanguage(lang)
  }

  const voterState = useMemo(() => (profile ? getVoterState(profile) : null), [profile])
  const statuses = useMemo(() => (profile ? getStepStatuses(profile) : null), [profile])

  const allDone = statuses
    ? (["eligibility", "registration", "verification", "voting"] as const).every(
        (id) => statuses[id] === "completed",
      )
    : false

  // Auto-trigger celebration the first time all 4 steps complete.
  useEffect(() => {
    if (!profile) return
    if (allDone && !profile.celebrationSeen) {
      setShowCelebration(true)
    }
  }, [allDone, profile])

  if (!hydrated) {
    return <DashboardSkeleton />
  }

  if (!profile) {
    return <EmptyState />
  }

  const lang = profile.language ?? "en"
  const firstName = profile.name.split(" ")[0]
  const initial = firstName[0]?.toUpperCase() ?? "M"

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Vote className="h-5 w-5" />
            </span>
            <span className="font-serif text-2xl tracking-tight">Matdaan</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher lang={lang} onChange={handleLanguageChange} />

            {allDone ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCelebration(true)}
                className="hidden rounded-full sm:inline-flex"
              >
                <PartyPopper className="mr-1 h-4 w-4" />
                Celebrate
              </Button>
            ) : null}

            <div className="hidden text-right md:block">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {t(lang, "dashboard.welcome")}
              </p>
              <p className="text-sm font-medium leading-tight">{firstName}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full border border-border bg-card p-0.5 pr-3 transition-colors hover:bg-secondary"
                  aria-label="Open account menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm sm:inline">{firstName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{profile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {t(lang, "dashboard.ageOf")} {profile.age} · {profile.state}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/onboarding")}>
                  <Settings2 className="mr-2 h-4 w-4" />
                  {t(lang, "dashboard.editProfile")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setProfile(null)
                    router.push("/")
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t(lang, "dashboard.reset")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatusBanner profile={profile} voterState={voterState!} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6 min-w-0">
            <JourneyStepper statuses={statuses!} profile={profile} />
            <StepGuide profile={profile} statuses={statuses!} onComplete={completeStep} />
            <ElectionTimeline profile={profile} />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <ChatPanel profile={profile} voterState={voterState!} />
          </div>
        </div>
      </main>

      {showCelebration ? (
        <CelebrationOverlay
          profile={profile}
          onClose={() => {
            setShowCelebration(false)
            if (!profile.celebrationSeen) patch({ celebrationSeen: true })
          }}
        />
      ) : null}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-10 w-48 rounded-md bg-muted" />
        <div className="mt-10 h-48 rounded-2xl bg-muted" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="h-40 rounded-2xl bg-muted" />
            <div className="h-64 rounded-2xl bg-muted" />
            <div className="h-64 rounded-2xl bg-muted" />
          </div>
          <div className="h-[560px] rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
