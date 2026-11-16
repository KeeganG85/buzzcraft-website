import { NextResponse } from "next/server";
import {
  PROMPT_COOKIE,
  hashPromptToken,
  newPromptToken,
  parseRegistration,
  saveRegistration,
} from "@/lib/prompt-access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const token = newPromptToken();
  const parsed = parseRegistration(body, hashPromptToken(token));
  if (!parsed.ok && "honeypot" in parsed) return NextResponse.json({ ok: true });
  if (!parsed.ok) return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 422 });

  const storage = await saveRegistration(parsed.registration);
  if (storage !== "saved") {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Registration storage is not configured, so the library stays locked. Full prompt bodies are not sent to the browser.",
      },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(PROMPT_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  return response;
}
