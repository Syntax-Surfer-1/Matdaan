"use client"

import { Check, Languages } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LANGUAGES, t } from "@/lib/i18n"
import type { Lang } from "@/lib/types"

export function LanguageSwitcher({
  lang,
  onChange,
}: {
  lang: Lang
  onChange: (lang: Lang) => void
}) {
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
          aria-label={t(lang, "lang.switcher")}
        >
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="hidden sm:inline">{current.native}</span>
          <span className="sm:hidden font-mono text-xs uppercase">{current.code}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          {t(lang, "lang.switcher")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((l) => {
          const active = l.code === lang
          return (
            <DropdownMenuItem
              key={l.code}
              onClick={() => onChange(l.code)}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex flex-col">
                <span className="font-medium">{l.native}</span>
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
              {active ? <Check className="h-4 w-4 text-primary" /> : null}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
