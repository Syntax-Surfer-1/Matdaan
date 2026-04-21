"use client"

import { Bot, Compass, ListChecks, ShieldCheck } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Features() {
  const { t } = useLanguage()

  const items = [
    { Icon: Compass, title: t("features.adaptive.title"), body: t("features.adaptive.body") },
    { Icon: ListChecks, title: t("features.journey.title"), body: t("features.journey.body") },
    { Icon: Bot, title: t("features.chat.title"), body: t("features.chat.body") },
    { Icon: ShieldCheck, title: t("features.private.title"), body: t("features.private.body") },
  ]

  return (
    <section id="features" className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("features.eyebrow")}
            </p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight text-balance sm:text-5xl">
              {t("features.title")}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("features.intro")}
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, title, body }) => (
            <article
              key={title}
              className="group flex flex-col gap-4 bg-card p-7 transition-colors hover:bg-secondary/50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors group-hover:border-accent group-hover:text-accent">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-serif text-xl leading-snug">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
