import type { MetadataRoute } from "next"

/**
 * PWA manifest so users can install Matdaan on Android / ChromeOS.
 * Keeps the same editorial color palette as the app.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Matdaan — Your Smart Election Companion",
    short_name: "Matdaan",
    description:
      "AI-powered, multilingual guidance for first-time voters in India.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f6ee",
    theme_color: "#1b2649",
    orientation: "portrait-primary",
    lang: "en-IN",
    categories: ["government", "education", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  }
}
