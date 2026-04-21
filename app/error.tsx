"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Next.js app-router error boundary. Must be a client component.
 * Logs the error server-side via console (captured by Vercel) and offers
 * a reset + return-home path for the user.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] route error:", error)
  }, [error])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mx-auto my-20 flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center shadow-sm"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <div>
        <h2 className="font-serif text-3xl tracking-tight">Something went wrong</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve logged the issue. You can retry the action or head back home.
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-[11px] text-muted-foreground/70">
            ref: {error.digest}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={reset}>
          <RotateCcw className="mr-1 h-4 w-4" aria-hidden />
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-1 h-4 w-4" aria-hidden />
            Go home
          </Link>
        </Button>
      </div>
    </div>
  )
}
