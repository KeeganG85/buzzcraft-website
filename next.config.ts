import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    // The previous buzzcraft.co.za build was a single client-rendered landing
    // page with hash-anchor navigation, so there is no deep URL inventory to
    // preserve. These permanent redirects catch legacy paths that may exist in
    // old links, ads or profiles. TODO_VERIFY against Search Console before launch.
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/about", destination: "/services", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
      { source: "/portfolio", destination: "/work", permanent: true },
    ];
  },
};

export default nextConfig;
