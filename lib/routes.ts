/** Indexable marketing paths. Drafts, Studio, thank-you and legacy URLs stay off this list. */
export const indexablePaths = [
  "/",
  "/services",
  "/services/websites",
  "/services/search-visibility",
  "/services/lead-systems",
  "/pricing",
  "/sprint",
] as const;

export const blockedPaths = ["/studio/", "/api/", "/scorecard/thank-you/", "/promptlibrary/"] as const;
