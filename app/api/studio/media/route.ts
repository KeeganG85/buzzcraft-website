import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { formatBytes, inspectImage } from "@/lib/studio-media";
import { storageConfigured, studioSession } from "@/lib/studio";
import { deleteMediaAsset, insertMediaAsset, listMediaAssets, mediaUsageCount } from "@/lib/studio-store";

export const runtime = "nodejs";

function unavailable() {
  return NextResponse.json(
    { ok: false, error: "Media storage is not configured. You can still edit and save articles." },
    { status: 503 },
  );
}

function storageClient() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export async function GET() {
  const session = await studioSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!storageConfigured()) return unavailable();
  const assets = await listMediaAssets();
  if (!assets) return unavailable();
  return NextResponse.json({
    ok: true,
    assets: assets.map((asset) => ({ ...asset, sizeLabel: formatBytes(asset.byte_size) })),
  });
}

export async function POST(request: Request) {
  const session = await studioSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const client = storageClient();
  if (!client) return unavailable();
  const form = await request.formData();
  const alt = String(form.get("alt") ?? "").trim();
  const file = form.get("file");
  if (!alt) return NextResponse.json({ ok: false, error: "Alt text is required." }, { status: 422 });
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "Choose an image file." }, { status: 422 });
  const inspected = inspectImage(Buffer.from(await file.arrayBuffer()));
  if (!inspected) {
    return NextResponse.json(
      { ok: false, error: "Use a JPEG, PNG, WebP, AVIF, or a simple SVG under 5 MB." },
      { status: 422 },
    );
  }
  const storagePath = `${randomUUID()}.${inspected.extension}`;
  const upload = await fetch(`${client.url}/storage/v1/object/studio-media/${storagePath}`, {
    method: "POST",
    headers: {
      apikey: client.key,
      Authorization: `Bearer ${client.key}`,
      "Content-Type": inspected.mime,
      "x-upsert": "false",
    },
    body: new Uint8Array(inspected.bytes),
  });
  if (!upload.ok) return unavailable();
  const publicUrl = `${client.url}/storage/v1/object/public/studio-media/${storagePath}`;
  const saved = await insertMediaAsset({
    storage_path: storagePath,
    public_url: publicUrl,
    mime: inspected.mime,
    byte_size: inspected.bytes.length,
    width: inspected.width,
    height: inspected.height,
    alt,
  });
  if (!saved) return unavailable();
  return NextResponse.json({ ok: true, asset: { ...saved, sizeLabel: formatBytes(saved.byte_size) } });
}

export async function DELETE(request: Request) {
  const session = await studioSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const client = storageClient();
  if (!client) return unavailable();
  const body = (await request.json()) as { id?: string };
  const assets = await listMediaAssets();
  const asset = assets?.find((item) => item.id === body.id);
  if (!asset) return NextResponse.json({ ok: false, error: "That file was not found." }, { status: 404 });
  const used = await mediaUsageCount(asset.public_url, asset.storage_path);
  if (used === null) return unavailable();
  if (used > 0) {
    return NextResponse.json(
      { ok: false, error: `This file is used ${used} time${used === 1 ? "" : "s"}. Remove it from those articles before deleting it.` },
      { status: 409 },
    );
  }
  const removed = await fetch(`${client.url}/storage/v1/object/studio-media/${asset.storage_path}`, {
    method: "DELETE",
    headers: { apikey: client.key, Authorization: `Bearer ${client.key}` },
  });
  if (!removed.ok && removed.status !== 404) return unavailable();
  await deleteMediaAsset(asset.id);
  return NextResponse.json({ ok: true });
}
