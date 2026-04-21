"use client"

import { useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, Download, Share2, Sparkles, Star, Trophy, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { t } from "@/lib/i18n"
import type { Lang, UserProfile } from "@/lib/types"

type Particle = { id: number; left: number; delay: number; duration: number; size: number; color: string }

const COLORS = [
  "oklch(0.72 0.15 65)", // saffron
  "oklch(0.55 0.08 180)", // green
  "oklch(0.97 0.008 85)", // cream
  "oklch(0.25 0.04 255)", // deep navy
  "oklch(0.65 0.1 35)",  // terracotta
]

function useParticles(count: number): Particle[] {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.8 + Math.random() * 2.6,
        size: 6 + Math.random() * 10,
        color: COLORS[i % COLORS.length],
      })),
    [count],
  )
}

export function CelebrationOverlay({
  profile,
  onClose,
}: {
  profile: UserProfile
  onClose: () => void
}) {
  const lang: Lang = profile.language ?? "en"
  const firstName = profile.name.split(" ")[0]
  const particles = useParticles(42)

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  const daysOfGuidance = Math.max(
    1,
    Math.round((Date.now() - profile.createdAt) / (1000 * 60 * 60 * 24)),
  )

  async function handleShare() {
    const text = t(lang, "celebration.shareText")
    if (navigator.share) {
      try {
        await navigator.share({ title: "Matdaan", text })
        return
      } catch {
        // fall through
      }
    }
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* ignore */
    }
  }

  function handleDownload() {
    const svg = buildCertificateSvg(profile, firstName, lang)
    const blob = new Blob([svg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `matdaan-certificate-${firstName.toLowerCase()}.svg`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Celebration"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-primary/85 backdrop-blur-md" onClick={onClose} aria-hidden />

        {/* Confetti */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ y: -40, opacity: 0, rotate: 0 }}
              animate={{
                y: "110vh",
                opacity: [0, 1, 1, 0],
                rotate: 540,
                x: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 120],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                repeatDelay: 0.4,
                ease: "easeIn",
              }}
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size * 0.35,
                backgroundColor: p.color,
                borderRadius: 2,
              }}
              className="absolute top-0"
            />
          ))}
        </div>

        {/* Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        >
          <button
            onClick={onClose}
            aria-label="Close celebration"
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Decorative top band */}
          <div className="relative h-32 bg-gradient-to-br from-accent/30 via-accent/10 to-transparent">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 12 }}
                className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-lg ring-8 ring-background"
              >
                <Trophy className="h-10 w-10 text-primary-foreground" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 220 }}
                  className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md"
                >
                  <Star className="h-4 w-4 fill-current" />
                </motion.span>
              </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent" />
          </div>

          <div className="px-8 pb-8 pt-4 text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-accent-foreground"
            >
              <Sparkles className="h-3 w-3" />
              {t(lang, "celebration.eyebrow")}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl"
            >
              {t(lang, "celebration.title")}{" "}
              <span className="relative inline-block">
                <span className="relative z-10">{firstName}.</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  style={{ originX: 0 }}
                  className="absolute bottom-1 left-0 right-0 z-0 h-3 bg-accent/40"
                />
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground"
            >
              {t(lang, "celebration.subtitle")}
            </motion.p>

            {/* Stats */}
            <motion.dl
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-border bg-background p-4"
            >
              <Stat value="4 / 4" label={t(lang, "celebration.stat1")} />
              <Stat value={String(daysOfGuidance)} label={t(lang, "celebration.stat2")} />
              <Stat value={profile.state.split(" ")[0]} label={t(lang, "celebration.stat3")} />
            </motion.dl>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              <Button onClick={handleDownload} className="rounded-full">
                <Award className="mr-1 h-4 w-4" />
                {t(lang, "celebration.download")}
              </Button>
              <Button onClick={handleShare} variant="outline" className="rounded-full">
                <Share2 className="mr-1 h-4 w-4" />
                {t(lang, "celebration.share")}
              </Button>
              <Button onClick={onClose} variant="ghost" className="rounded-full">
                {t(lang, "celebration.close")}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-2xl leading-none tracking-tight">{value}</span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

function buildCertificateSvg(profile: UserProfile, firstName: string, lang: Lang): string {
  const title = t(lang, "celebration.eyebrow")
  const subtitle = t(lang, "celebration.subtitle")
  const safeName = escapeXml(firstName)
  const safeState = escapeXml(profile.state)
  const safeTitle = escapeXml(title)
  const safeSubtitle = escapeXml(subtitle)
  const dateStr = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f9f4e8"/>
      <stop offset="1" stop-color="#fff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect x="40" y="40" width="1120" height="720" fill="none" stroke="#1b2649" stroke-width="4"/>
  <rect x="56" y="56" width="1088" height="688" fill="none" stroke="#e0a651" stroke-width="1"/>
  <text x="600" y="180" text-anchor="middle" font-family="Georgia, serif" font-size="36" letter-spacing="8" fill="#8a6a2e">MATDAAN · ${safeTitle.toUpperCase()}</text>
  <text x="600" y="310" text-anchor="middle" font-family="Georgia, serif" font-size="72" fill="#1b2649">${safeName}</text>
  <line x1="340" y1="360" x2="860" y2="360" stroke="#1b2649" stroke-width="2"/>
  <text x="600" y="430" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#415273">${safeSubtitle}</text>
  <text x="600" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#1b2649">State · ${safeState}</text>
  <text x="600" y="600" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#8a6a2e">Completed on ${dateStr}</text>
  <circle cx="600" cy="680" r="38" fill="none" stroke="#e0a651" stroke-width="2"/>
  <text x="600" y="688" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#8a6a2e">MA</text>
</svg>`
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}
