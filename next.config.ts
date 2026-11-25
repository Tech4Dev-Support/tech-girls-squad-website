import type { NextConfig } from "next";

// Search engines: until launch, every page is marked "noindex".
// At launch, set ALLOW_INDEXING=true in Netlify and redeploy.
// The payment result pages always stay out of search results.
const allowIndexing = process.env.ALLOW_INDEXING === "true";
const noindexPaths = allowIndexing
  ? ["/order", "/order/:path*", "/donation/:path*", "/payment/:path*"]
  : ["/:path*"];

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.0.176', '10.132.109.230', '192.168.1.3', '192.168.*.*', '10.229.142.230'],
  async headers() {
    return noindexPaths.map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    }));
  },
};

export default nextConfig;
