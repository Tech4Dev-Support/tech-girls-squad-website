import type { MetadataRoute } from "next";

const SITE_URL = (process.env.SITE_URL || "https://tech-girls-squad.netlify.app").replace(/\/$/, "");

// One-page site: the homepage is the only page meant for search results.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
