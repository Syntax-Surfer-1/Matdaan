import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Vote } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Vote className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-serif text-4xl tracking-tight">
          Let&apos;s set up your journey.
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          Matdaan personalizes every step based on your age and registration status. It takes
          less than a minute.
        </p>
        <Button asChild size="lg" className="mt-8 rounded-full">
          <Link href="/onboarding">
            Start onboarding <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <p className="mt-6 text-xs text-muted-foreground">
          <Link href="/" className="underline underline-offset-4 hover:text-foreground">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
