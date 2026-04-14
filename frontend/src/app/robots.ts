import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.apc-ngo.org" // URL temporaire métier

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",      // Sera pour le CMS
        "/api/",       // Endpoints internes
        "/private/",   // Futures configurations
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
