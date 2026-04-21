"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Vote } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { saveProfile } from "@/lib/user-store"
import { getVoterState } from "@/lib/decision-engine"
import { toast } from "sonner"

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

type Step = 0 | 1 | 2 | 3

const STEP_LABELS = ["Your name", "Your age", "Registration", "Location"]

export function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(0)
  const [name, setName] = useState("")
  const [age, setAge] = useState<string>("")
  const [isRegistered, setIsRegistered] = useState<"yes" | "no" | "">("")
  const [hasVoterId, setHasVoterId] = useState<"yes" | "no" | "">("")
  const [stateValue, setStateValue] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)

  const ageNumber = useMemo(() => {
    const n = Number(age)
    return Number.isFinite(n) ? n : NaN
  }, [age])

  const canAdvance = useMemo(() => {
    if (step === 0) return name.trim().length >= 2
    if (step === 1)
      return !Number.isNaN(ageNumber) && ageNumber >= 0 && ageNumber <= 120
    if (step === 2) {
      if (ageNumber < 18) return true
      if (!isRegistered) return false
      if (isRegistered === "yes" && !hasVoterId) return false
      return true
    }
    if (step === 3) return stateValue.length > 0
    return false
  }, [step, name, ageNumber, isRegistered, hasVoterId, stateValue])

  const totalSteps = 4

  function next() {
    if (!canAdvance) return
    if (step < 3) {
      setStep((s) => (s + 1) as Step)
      return
    }
    submit()
  }

  function back() {
    if (step === 0) return
    setStep((s) => (s - 1) as Step)
  }

  function submit() {
    setSubmitting(true)
    const registered = ageNumber < 18 ? false : isRegistered === "yes"
    const hasId = registered ? hasVoterId === "yes" : false
    const existingLang =
      typeof window !== "undefined"
        ? ((JSON.parse(window.localStorage.getItem("matdaan.user.v1") ?? "null")?.language ??
            "en") as "en" | "hi" | "mr" | "ta" | "te" | "bn")
        : ("en" as const)

    const profile = {
      name: name.trim(),
      age: ageNumber,
      isRegistered: registered,
      hasVoterId: hasId,
      state: stateValue,
      completedSteps: [] as ("eligibility" | "registration" | "verification" | "voting")[],
      language: existingLang,
      createdAt: Date.now(),
    }
    saveProfile(profile)
    const voterState = getVoterState(profile)
    toast.success("Profile saved", {
      description: `Status: ${voterState.replaceAll("_", " ").toLowerCase()}.`,
    })
    setTimeout(() => router.push("/dashboard"), 400)
  }

  return (
    <div className="relative min-h-dvh bg-background">
      <div className="absolute inset-0 -z-10 grid-pattern opacity-40" aria-hidden />
      <div className="absolute inset-0 -z-10 noise-bg" aria-hidden />

      <header className="flex items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Vote className="h-4 w-4" />
          </span>
          <span className="font-serif text-xl">Matdaan</span>
        </Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          Cancel
        </Link>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col px-4 pb-16 pt-6 sm:pt-12">
        <div className="mb-10">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= step ? "bg-primary" : "bg-border",
                )}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Step <span className="font-medium text-foreground">{step + 1}</span> of{" "}
              {totalSteps}
            </span>
            <span>{STEP_LABELS[step]}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {step === 0 && (
              <>
                <Heading
                  eyebrow="Welcome"
                  title="What should we call you?"
                  subtitle={"We'll use your first name to personalize guidance. Nothing is stored on our servers."}
                />
                <div className="space-y-2">
                  <Label htmlFor="name">First name</Label>
                  <Input
                    id="name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya"
                    className="h-12 text-base"
                    onKeyDown={(e) => e.key === "Enter" && next()}
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <Heading
                  eyebrow={`Hi, ${name.split(" ")[0]}`}
                  title="How old are you?"
                  subtitle="We need your age to check eligibility on the qualifying date. You must be 18+ to register."
                />
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    autoFocus
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 19"
                    className="h-12 text-base"
                    onKeyDown={(e) => e.key === "Enter" && next()}
                  />
                  {!Number.isNaN(ageNumber) && ageNumber >= 0 && ageNumber <= 120 ? (
                    <p className="pt-1 text-sm text-muted-foreground">
                      {ageNumber < 18
                        ? `You'll be eligible in ${18 - ageNumber} year${
                            18 - ageNumber === 1 ? "" : "s"
                          }. We'll still help you prepare.`
                        : `Great — you're eligible to vote.`}
                    </p>
                  ) : null}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {ageNumber < 18 ? (
                  <>
                    <Heading
                      eyebrow="Registration"
                      title={"We'll skip this one."}
                      subtitle={"Since you're under 18, there's no registration status to confirm yet. You can pre-enroll closer to your 18th birthday."}
                    />
                    <div className="rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
                      {"Once you turn 17, India allows advance enrolment so you're on the roll the moment you turn 18. Matdaan will remind you."}
                    </div>
                  </>
                ) : (
                  <>
                    <Heading
                      eyebrow="Registration"
                      title="Are you registered to vote?"
                      subtitle={"Being registered means your name appears on your constituency's electoral roll."}
                    />
                    <RadioGroup
                      value={isRegistered}
                      onValueChange={(v) => setIsRegistered(v as "yes" | "no")}
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      <OptionCard
                        id="reg-yes"
                        value="yes"
                        checked={isRegistered === "yes"}
                        title={"Yes, I'm registered"}
                        subtitle="My name is on the electoral roll."
                      />
                      <OptionCard
                        id="reg-no"
                        value="no"
                        checked={isRegistered === "no"}
                        title="No, not yet"
                        subtitle={"I haven't filed Form 6."}
                      />
                    </RadioGroup>

                    {isRegistered === "yes" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 pt-2"
                      >
                        <Label>Do you have your Voter ID (EPIC)?</Label>
                        <RadioGroup
                          value={hasVoterId}
                          onValueChange={(v) => setHasVoterId(v as "yes" | "no")}
                          className="grid gap-3 sm:grid-cols-2"
                        >
                          <OptionCard
                            id="epic-yes"
                            value="yes"
                            checked={hasVoterId === "yes"}
                            title="Yes, I have it"
                            subtitle="Physical or digital EPIC."
                          />
                          <OptionCard
                            id="epic-no"
                            value="no"
                            checked={hasVoterId === "no"}
                            title="Not yet"
                            subtitle="I need to download it."
                          />
                        </RadioGroup>
                      </motion.div>
                    )}
                  </>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <Heading
                  eyebrow="Location"
                  title="Which state are you in?"
                  subtitle={"Election schedules and polling booths are state-specific. We'll use this to tailor timelines."}
                />
                <div className="space-y-2">
                  <Label htmlFor="state">State / UT</Label>
                  <Select value={stateValue} onValueChange={setStateValue}>
                    <SelectTrigger id="state" className="h-12 text-base">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </motion.section>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 0 || submitting}
            className="rounded-full"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={next}
            disabled={!canAdvance || submitting}
            className="rounded-full px-6"
            size="lg"
          >
            {step === 3 ? (
              <>
                {submitting ? "Saving..." : "Finish"}
                <Check className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}

function Heading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>
      <h1 className="font-serif text-4xl leading-tight tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>
      <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
    </div>
  )
}

function OptionCard({
  id,
  value,
  checked,
  title,
  subtitle,
}: {
  id: string
  value: string
  checked: boolean
  title: string
  subtitle: string
}) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 transition-all",
        checked
          ? "border-primary bg-secondary/70 shadow-sm"
          : "border-border hover:border-foreground/30",
      )}
    >
      <RadioGroupItem id={id} value={value} className="mt-1" />
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{subtitle}</div>
      </div>
    </Label>
  )
}
