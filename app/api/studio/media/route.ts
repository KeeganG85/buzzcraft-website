import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { formatBytes, inspectImage, isSvgUpload } from "@/lib/studio-media";
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

async function removeStoredObject(client: { url: string; key: string }, storagePath: string): Promise<{ ok: boolean; status?: number }> {
  try {
    const response = await fetch(`${client.url}/storage/v1/object/studio-media/${storagePath}`, {
      method: "DELETE",
      headers: { apikey: client.key, Authorization: `Bearer ${client.key}` },
    });
    return { ok: response.ok || response.status === 404, status: response.status };
  } catch {
    return { ok: false };
  }
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
  if (isSvgUpload(file.name, file.type)) {
    return NextResponse.json({ ok: false, error: "SVG files are not supported. Use a JPEG, PNG, WebP, or AVIF image under 5 MB." }, { status: 422 });
  }
  const inspected = inspectImage(Buffer.from(await file.arrayBuffer()));
  if (!inspected) {
    return NextResponse.json(
      { ok: false, error: "Use a JPEG, PNG, WebP, or AVIF image under 5 MB." },
      { status: 422 },
    );
  }
  const storagePath = `${randomUUID()}.${inspected.extension}`;
  let upload: Response;
  try {
    upload = await fetch(`${client.url}/storage/v1/object/studio-media/${storagePath}`, {
      method: "POST",
      headers: {
        apikey: client.key,
        Authorization: `Bearer ${client.key}`,
        "Content-Type": inspected.mime,
        "x-upsert": "false",
      },
      body: new Uint8Array(inspected.bytes),
    });
  } catch {
    return unavailable();
  }
  if (!upload.ok) return unavailable();
  const publicUrl = `${client.url}/storage/v1/object/public/studio-media/${storagePath}`;
  let saved;
  try {
    saved = await insertMediaAsset({
      storage_path: storagePath,
      public_url: publicUrl,
      mime: inspected.mime,
      byte_size: inspected.bytes.length,
      width: inspected.width,
      height: inspected.height,
      alt,
    });
  } catch {
    saved = null;
  }
  if (!saved) {
    const cleanup = await removeStoredObject(client, storagePath);
    if (!cleanup.ok) {
      const failure = cleanup.status ? ` (storage returned HTTP ${cleanup.status})` : " (storage request failed)";
      return NextResponse.json(
        { ok: false, error: `Media metadata could not be created, and cleanup of uploaded object ${storagePath} failed${failure}. The object may remain in storage.` },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { ok: false, error: "Media metadata could not be created. The uploaded object was removed." },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true, asset: { ...saved, sizeLabel: formatBytes(saved.byte_size) } });
}

export async function DELETE(request: Request) {
  const session = await studioSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const client = storageClient();
  if (!client) return unavailable();
  const body = (await request.json()) as { id?: string };
  let assets;
  try {
    assets = await listMediaAssets();
  } catch {
    assets = null;
  }
  if (!assets) {
    return NextResponse.json({ ok: false, error: "Media metadata could not be read, so nothing was deleted. Retry when storage is available." }, { status: 503 });
  }
  const asset = assets.find((item) => item.id === body.id);
  if (!asset) return NextResponse.json({ ok: true, alreadyDeleted: true });
  let used: number | null;
  try {
    used = await mediaUsageCount(asset.public_url, asset.storage_path);
  } catch {
    used = null;
  }
  if (used === null) {
    return NextResponse.json({ ok: false, error: "Media usage could not be checked, so nothing was deleted. Retry when storage is available." }, { status: 503 });
  }
  if (used > 0) {
    return NextResponse.json(
      { ok: false, error: `This file is used ${used} time${used === 1 ? "" : "s"}. Remove it from those articles before deleting it.` },
      { status: 409 },
    );
  }
  const removed = await removeStoredObject(client, asset.storage_path);
  if (!removed.ok) {
    const failure = removed.status ? ` (storage returned HTTP ${removed.status})` : " (storage request failed)";
    return NextResponse.json(
      { ok: false, error: `The stored object could not be removed${failure}. Its metadata was retained so this deletion can be retried.` },
      { status: 503 },
    );
  }
  let metadataDeleted = false;
  try {
    metadataDeleted = await deleteMediaAsset(asset.id);
  } catch {
    metadataDeleted = false;
  }
  if (!metadataDeleted) {
    return NextResponse.json(
      { ok: false, error: "The object is removed, but its metadata could not be deleted. The metadata remains; retrying this deletion is safe." },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true });
}
