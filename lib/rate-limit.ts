const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;

type Bucket = { count: number; reset: number };

/**
 * In-memory limit. Each serverless instance keeps its own map, so this is not a
 * global cap and resets when that instance goes away.
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

/**
 * Forwarded addresses are usable only when the caller has verified the actual
 * trusted ingress. Studio login currently has no such verification, so it opts
 * out and all requests share an `unknown` bucket within each application instance.
 */
export function requestIp(
  request: Request,
  options: { trustForwardedFor?: boolean } = {},
): string {
  if (options.trustForwardedFor === false) return "unknown";
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
