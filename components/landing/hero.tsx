"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-pattern opacity-60" aria-hidden />
      <div className="absolute inset-0 -z-10 noise-bg" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {t("hero.badge")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 font-serif text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl"
            >
              {t("hero.titleA")}{" "}
              <span className="italic text-accent">{t("hero.titleItalic")}</span>
              <br />
              {t("hero.titleB")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/onboarding">
                  {t("hero.cta.start")}
                  <ArrowRight className="ml-0.5 h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-full">
                <Link href="#features">{t("hero.cta.learn")}</Link>
              </Button>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/60 pt-8"
            >
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t("hero.stat.steps")}
                </dt>
                <dd className="mt-1 font-serif text-3xl">04</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t("hero.stat.languages")}
                </dt>
                <dd className="mt-1 font-serif text-3xl">07</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t("hero.stat.bias")}
                </dt>
                <dd className="mt-1 font-serif text-3xl">{t("hero.stat.bias.value")}</dd>
              </div>
            </motion.dl>
          </div>

          <HeroCard />
        </div>
      </div>
    </section>
  )
}

function HeroCard() {
  const { t } = useLanguage()
  const checks = [
    { label: t("hero.preview.check1"), done: true },
    { label: t("hero.preview.check2"), done: false, active: true },
    { label: t("hero.preview.check3"), done: false },
    { label: t("hero.preview.check4"), done: false },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-primary/10 blur-2xl" />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_80px_-40px_oklch(0.22_0.02_255/0.35)]">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("hero.preview.live")}
            </span>
          </div>
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        </div>

        <div className="space-y-4 p-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("hero.preview.status")}
            </p>
            <p className="font-serif text-2xl leading-tight">{t("hero.preview.statusValue")}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/4 rounded-full bg-primary" />
            </div>
            <span>{t("hero.preview.stepOf")}</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {checks.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-3 py-2.5"
              >
                <span
                  className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[10px] ${
                    s.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : s.active
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border text-muted-foreground"
                  }`}
                  aria-hidden
                >
                  {s.done ? "✓" : s.active ? "●" : ""}
                </span>
                <span
                  className={`text-sm ${
                    s.active
                      ? "font-medium text-foreground"
                      : s.done
                        ? "text-muted-foreground line-through"
                        : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-secondary/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("hero.preview.says")}
            </p>
            <p
              className="mt-1.5 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: t("hero.preview.quote").replace(
                  /\*\*(.+?)\*\*/g,
                  '<span class="font-semibold">$1</span>',
                ),
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
