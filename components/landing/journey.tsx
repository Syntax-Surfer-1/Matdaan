"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function Journey() {
  const { t } = useLanguage()

  const steps = [
    { num: "01", title: t("journey.landing.s1.title"), body: t("journey.landing.s1.body") },
    { num: "02", title: t("journey.landing.s2.title"), body: t("journey.landing.s2.body") },
    { num: "03", title: t("journey.landing.s3.title"), body: t("journey.landing.s3.body") },
    { num: "04", title: t("journey.landing.s4.title"), body: t("journey.landing.s4.body") },
  ]

  return (
    <section id="journey" className="bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("journey.landingEyebrow")}
            </p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight text-balance sm:text-5xl">
              {t("journey.landingTitleA")}{" "}
              <span className="italic text-accent">{t("journey.landingTitleB")}</span>
            </h2>
            <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
              {t("journey.landingIntro")}
            </p>
            <Button asChild variant="outline" className="mt-8 rounded-full">
              <Link href="/onboarding">{t("journey.landingCta")}</Link>
            </Button>
          </div>

          <ol className="relative space-y-8 border-l border-border/80 pl-8">
            {steps.map((j) => (
              <li key={j.num} className="relative">
                <span className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                </span>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-muted-foreground">{j.num}</span>
                  <h3 className="font-serif text-2xl tracking-tight">{j.title}</h3>
                </div>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {j.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
