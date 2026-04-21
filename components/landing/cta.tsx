"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CtaSection() {
  const { t } = useLanguage()

  return (
    <section className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground">
          <div
            className="absolute inset-0 opacity-[0.07]"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 30%, white 0, transparent 50%), radial-gradient(circle at 70% 70%, white 0, transparent 50%)",
            }}
          />

          <div className="relative grid gap-10 p-10 sm:p-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-20">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">
                {t("cta.eyebrow")}
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {t("cta.titleA")}
                <br />
                <span className="italic text-accent">{t("cta.titleB")}</span>
              </h2>
              <p className="mt-5 max-w-md text-pretty text-primary-foreground/75">
                {t("cta.body")}
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/onboarding">
                  {t("cta.primary")}
                  <ArrowUpRight className="ml-1 h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/dashboard">{t("cta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
