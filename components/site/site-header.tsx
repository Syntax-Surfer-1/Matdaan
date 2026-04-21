"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Vote } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/dashboard/language-switcher"

export function SiteHeader() {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Matdaan home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:-rotate-6">
            <Vote className="h-5 w-5" aria-hidden />
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl leading-none tracking-tight">Matdaan</span>
            <span className="hidden text-xs uppercase tracking-[0.18em] text-muted-foreground sm:inline">
              Smart Election Assistant
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <Link
            href="/#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.features")}
          </Link>
          <Link
            href="/#journey"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.journey")}
          </Link>
          <Link
            href="/#faq"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.faq")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher lang={language} onChange={setLanguage} />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn("hidden sm:inline-flex", isDashboard && "hidden")}
          >
            <Link href="/dashboard">{t("nav.openDashboard")}</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link href={isDashboard ? "/" : "/onboarding"}>
              {isDashboard ? t("nav.home") : t("nav.getStarted")}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
