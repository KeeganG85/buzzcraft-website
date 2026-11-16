import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
