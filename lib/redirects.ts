export type RedirectRule =
  | { source: string; destination: string; permanent: true }
  | { source: string; destination: string; statusCode: 301 };

/**
 * Legacy paths from the earlier one-page site.
 * /promptlibrary is added with the tools stage, once its target exists.
 * /about and /contact are real pages in later stages, so they are not redirected away.
 */
export const legacyRedirects: RedirectRule[] = [
  { source: "/home", destination: "/", permanent: true },
  { source: "/index.html", destination: "/", permanent: true },
  { source: "/blog", destination: "/insights", permanent: true },
  { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
  { source: "/portfolio", destination: "/work", permanent: true },
  /**
   * The legacy page is titled BuzzCraft Prompt OS and the live tools link
   * used that name. FOUND is a different open library, so /promptlibrary
   * goes to the 120 Prompt OS product page, not to /found or the tools hub.
   */
  { source: "/promptlibrary", destination: "/120promptos", statusCode: 301 },
  { source: "/promptlibrary/:path*", destination: "/120promptos", statusCode: 301 },
];
