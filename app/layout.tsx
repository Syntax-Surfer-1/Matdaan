import type { Metadata, Viewport } from "next"
import {
  Instrument_Serif,
  Inter,
  Noto_Sans_Bengali,
  Noto_Sans_Devanagari,
  Noto_Sans_Gujarati,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
} from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { LanguageProvider } from "@/lib/language-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-custom",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif-custom",
  display: "swap",
})

// Indic script fonts — Google Noto family gives high-quality, balanced
// coverage for Hindi (hi) / Marathi (mr) [Devanagari], Gujarati (gu),
// Tamil (ta), Telugu (te), and Bengali (bn). They all load with
// display: swap so we never block first paint.
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
})
const notoGujarati = Noto_Sans_Gujarati({
  subsets: ["gujarati"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-gujarati",
  display: "swap",
})
const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-tamil",
  display: "swap",
})
const notoTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-telugu",
  display: "swap",
})
const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://matdaan.app"),
  title: {
    default: "Matdaan — Your Smart Election Companion",
    template: "%s · Matdaan",
  },
  description:
    "A smart, adaptive assistant that guides first-time voters through eligibility, registration, and voting day — aligned with the Election Commission of India.",
  generator: "v0.app",
  applicationName: "Matdaan",
  keywords: [
    "election",
    "voting",
    "India",
    "first-time voter",
    "voter registration",
    "ECI",
    "Gemini",
    "smart assistant",
  ],
  authors: [{ name: "Matdaan" }],
  openGraph: {
    title: "Matdaan — Your Smart Election Companion",
    description:
      "A multilingual, AI-powered guide for first-time voters in India, aligned with the Election Commission of India.",
    type: "website",
    locale: "en_IN",
    alternateLocale: ["hi_IN", "mr_IN", "gu_IN", "ta_IN", "te_IN", "bn_IN"],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f6ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fontVars = [
    inter.variable,
    instrumentSerif.variable,
    notoDevanagari.variable,
    notoGujarati.variable,
    notoTamil.variable,
    notoTelugu.variable,
    notoBengali.variable,
  ].join(" ")

  return (
    <html lang="en" className={`${fontVars} bg-background`}>
      <body className="font-sans antialiased">
        {/* Accessibility: skip link for keyboard / screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground focus:shadow-lg"
        >
          Skip to main content
        </a>
        <LanguageProvider>{children}</LanguageProvider>
        <Toaster richColors position="top-center" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
