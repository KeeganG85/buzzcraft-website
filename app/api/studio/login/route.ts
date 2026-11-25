import { NextResponse } from "next/server";
import { loginRateLimiter, requestIp } from "@/lib/rate-limit";
import { signStudioSession, studioCookie, studioConfigured, verifyStudioPassword } from "@/lib/studio";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (loginRateLimiter.limited(requestIp(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again shortly." },
      { status: 429 },
    );
  }
  if (!studioConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Studio login is not configured. Set STUDIO_EMAIL, STUDIO_PASSWORD_HASH and STUDIO_SESSION_SECRET." },
      { status: 503 },
    );
  }
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const expected = process.env.STUDIO_EMAIL?.trim().toLowerCase();
  const hash = process.env.STUDIO_PASSWORD_HASH ?? "";
  if (email !== expected || !verifyStudioPassword(password, hash)) {
    return NextResponse.json({ ok: false, error: "Those details do not match." }, { status: 401 });
  }
  const token = signStudioSession(email);
  if (!token) return NextResponse.json({ ok: false }, { status: 503 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(studioCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
