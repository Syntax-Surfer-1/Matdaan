"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: (opts: { error: Error; reset: () => void }) => ReactNode
}

interface State {
  error: Error | null
}

/**
 * Class-based React error boundary. Any uncaught render error in the subtree
 * surfaces here instead of breaking the whole app. Accessible fallback UI
 * with a reset button, and errors are logged with a `[v0]` prefix for
 * easy filtering in Vercel logs.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[v0] render error:", error, info.componentStack)
  }

  private reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    if (this.props.fallback) return this.props.fallback({ error, reset: this.reset })

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="mx-auto my-12 flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <h2 className="font-serif text-2xl tracking-tight">Something went sideways</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The page hit an unexpected error. You can try again, or reload if this keeps happening.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={this.reset}>Try again</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </div>
      </div>
    )
  }
}
