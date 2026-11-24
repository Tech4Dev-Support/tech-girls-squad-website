import type { MetadataRoute } from "next";

const SITE_URL = (process.env.SITE_URL || "https://tech-girls-squad.netlify.app").replace(/\/$/, "");

// Crawling stays open so search engines can see the "noindex" signal set in
// next.config.ts. Until launch (ALLOW_INDEXING not set to "true"), every page
// carries that signal, so nothing gets listed in search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
