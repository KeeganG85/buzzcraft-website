import { NextResponse } from "next/server";
import { studioSession } from "@/lib/studio";
import { saveCaseStudy } from "@/lib/studio-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await studioSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const slug = String(body.slug ?? "").trim();
  const clientName = String(body.client_name ?? "").trim();
  const url = String(body.url ?? "").trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !clientName || !url) {
    return NextResponse.json({ ok: false, error: "Slug, client name and URL are required." }, { status: 422 });
  }
  const saved = await saveCaseStudy({
    slug,
    client_name: clientName,
    url,
    location: String(body.location ?? "").trim(),
    summary: String(body.summary ?? "").trim(),
    observed: String(body.observed ?? "").trim(),
    status: body.intent === "publish" ? "published" : "draft",
  });
  if (!saved) {
    return NextResponse.json(
      { ok: false, error: "Case study storage is not configured." },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true, study: saved });
}
