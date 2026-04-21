"use client"

import Link from "next/link"
import { Vote } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function SiteFooter() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Vote className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-serif text-2xl tracking-tight">Matdaan</span>
          </div>
          <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            {t("footer.tagline")}
          </p>
          <p className="mt-6 text-xs text-muted-foreground">{t("footer.disclaimer")}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium">{t("footer.explore")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/onboarding" className="hover:text-foreground">
                {t("footer.begin")}
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-foreground">
                {t("footer.openDashboard")}
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-foreground">
                {t("footer.faq")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium">{t("footer.official")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="https://voters.eci.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                {t("footer.eciPortal")}
              </a>
            </li>
            <li>
              <a
                href="https://eci.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                {t("footer.eci")}
              </a>
            </li>
            <li>
              <a
                href="https://www.nvsp.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                {t("footer.nvsp")}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>{t("footer.rights", { year })}</p>
        </div>
      </div>
    </footer>
  )
}
