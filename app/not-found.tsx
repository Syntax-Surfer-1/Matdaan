import Link from "next/link"
import { Compass, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Page not found",
  description: "The page you&apos;re looking for doesn&apos;t exist.",
}

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto my-20 flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center shadow-sm"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
        <Compass className="h-6 w-6" aria-hidden />
      </span>
      <div>
        <h1 className="font-serif text-3xl tracking-tight">{"We can't find that page"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The link may be stale or the page may have moved. Let&apos;s get you back on track.
        </p>
      </div>
      <Button asChild>
        <Link href="/">
          <Home className="mr-1 h-4 w-4" aria-hidden />
          Back to home
        </Link>
      </Button>
    </main>
  )
}
