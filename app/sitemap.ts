import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://matdaan.app"
  const now = new Date()
  return [
    { url: `${base}/`, lastModified: now, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/onboarding`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/dashboard`, lastModified: now, priority: 0.8, changeFrequency: "weekly" },
  ]
}
