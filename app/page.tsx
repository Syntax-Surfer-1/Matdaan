import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Journey } from "@/components/landing/journey"
import { Faq } from "@/components/landing/faq"
import { CtaSection } from "@/components/landing/cta"

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <Features />
        <Journey />
        <Faq />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
