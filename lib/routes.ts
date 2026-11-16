/** Indexable marketing paths. Drafts, Studio, thank-you and legacy URLs stay off this list. */
export const indexablePaths = [
  "/",
  "/services",
  "/services/websites",
  "/services/search-visibility",
  "/services/lead-systems",
  "/pricing",
  "/sprint",
  "/contact",
  "/scorecard",
  "/privacy",
  "/tools",
  "/found",
  "/120promptos",
  "/120promptos/library",
  "/120promptos/privacy",
  "/120promptos/popia",
  "/120promptos/terms",
  "/120promptos/contact",
  "/insights",
  "/about",
  "/work",
  "/work/nativ-genetix-soweto",
  "/work/czapay",
] as const;

export const blockedPaths = ["/studio/", "/api/", "/scorecard/thank-you/", "/promptlibrary/"] as const;
