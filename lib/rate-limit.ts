const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;

type Bucket = { count: number; reset: number };

/**
 * In-memory limit, same shape as the Scorecard route.
 * Each serverless instance keeps its own map, so the limit resets when that instance goes away.
 */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, Bucket>();
  return {
    limited(key: string, now = Date.now()): boolean {
      const entry = hits.get(key);
      if (!entry || now > entry.reset) {
        hits.set(key, { count: 1, reset: now + windowMs });
        return false;
      }
      entry.count += 1;
      return entry.count > limit;
    },
    reset(): void {
      hits.clear();
    },
  };
}

export const loginRateLimiter = createRateLimiter(LOGIN_LIMIT, LOGIN_WINDOW_MS);

export function requestIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
