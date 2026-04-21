import type { MetadataRoute } from "next"

/**
 * Google-friendly robots.txt. We allow everything except the API routes,
 * which are POST-only anyway and shouldn&apos;t be indexed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://matdaan.app/sitemap.xml",
  }
}
