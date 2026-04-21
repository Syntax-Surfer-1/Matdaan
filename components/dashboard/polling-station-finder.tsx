"use client"

import { memo, useMemo, useState } from "react"
import { MapPin, Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { t } from "@/lib/i18n"
import type { UserProfile } from "@/lib/types"

interface Props {
  profile: UserProfile
}

/**
 * Polling Station Finder — embeds Google Maps for the user's area.
 *
 * Google Services used:
 *  - Google Maps Embed (via `https://www.google.com/maps?...&output=embed`)
 *    which does not require a Maps JS API key for read-only display.
 *
 * The embed runs in a sandboxed iframe. We never forward user input to any
 * third-party service other than Google Maps itself.
 */
function PollingStationFinderComponent({ profile }: Props) {
  const lang = profile.language ?? "en"
  const [query, setQuery] = useState("")
  const [committedQuery, setCommittedQuery] = useState<string | null>(null)

  // Default to the user's state + "polling booth" so the first render is useful.
  const effectiveQuery = useMemo(() => {
    const q = committedQuery ?? `${profile.state} polling booth India`
    return q.trim()
  }, [committedQuery, profile.state])

  const mapSrc = useMemo(
    () =>
      `https://www.google.com/maps?q=${encodeURIComponent(effectiveQuery)}&output=embed`,
    [effectiveQuery],
  )

  const mapsExternalHref = `https://www.google.com/maps/search/${encodeURIComponent(effectiveQuery)}`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    // Append state for a more geographically relevant search.
    setCommittedQuery(`${trimmed}, ${profile.state}, India`)
  }

  return (
    <section
      aria-labelledby="polling-finder-heading"
      className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] sm:p-6"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {t(lang, "polling.eyebrow")}
          </p>
          <h2
            id="polling-finder-heading"
            className="mt-1 font-serif text-2xl tracking-tight text-foreground"
          >
            {t(lang, "polling.title")}
          </h2>
          <p className="mt-1 max-w-prose text-pretty text-sm leading-relaxed text-muted-foreground">
            {t(lang, "polling.subtitle")}
          </p>
        </div>
        <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </span>
      </header>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Label htmlFor="polling-query" className="sr-only">
            {t(lang, "polling.queryLabel")}
          </Label>
          <Input
            id="polling-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(lang, "polling.queryPlaceholder")}
            maxLength={120}
            autoComplete="off"
            className="h-11"
          />
        </div>
        <Button type="submit" className="h-11 whitespace-nowrap">
          <Search className="mr-2 h-4 w-4" aria-hidden="true" />
          {t(lang, "polling.search")}
        </Button>
      </form>

      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-muted">
        <iframe
          key={mapSrc /* force iframe reload on query change */}
          src={mapSrc}
          title={`Google Maps showing ${effectiveQuery}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          className="h-[260px] w-full border-0 sm:h-[320px]"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full bg-transparent"
        >
          <a
            href={mapsExternalHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(lang, "polling.openMaps")}
          >
            <MapPin className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {t(lang, "polling.openMaps")}
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full bg-transparent"
        >
          <a
            href="https://voters.eci.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(lang, "polling.openEci")}
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {t(lang, "polling.openEci")}
          </a>
        </Button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        {t(lang, "polling.hint")}
      </p>
    </section>
  )
}

export const PollingStationFinder = memo(PollingStationFinderComponent)
