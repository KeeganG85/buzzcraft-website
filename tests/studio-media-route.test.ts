import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  studioSession,
  storageConfigured,
  insertMediaAsset,
  listMediaAssets,
  mediaUsageCount,
  deleteMediaAsset,
} = vi.hoisted(() => ({
  studioSession: vi.fn(),
  storageConfigured: vi.fn(),
  insertMediaAsset: vi.fn(),
  listMediaAssets: vi.fn(),
  mediaUsageCount: vi.fn(),
  deleteMediaAsset: vi.fn(),
}));

vi.mock("@/lib/studio", () => ({ studioSession, storageConfigured }));
vi.mock("@/lib/studio-store", () => ({ insertMediaAsset, listMediaAssets, mediaUsageCount, deleteMediaAsset }));

import { DELETE, POST } from "@/app/api/studio/media/route";

const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
const asset = {
  id: "11111111-1111-4111-8111-111111111111",
  storage_path: "asset.png",
  public_url: "https://storage.example/object/public/studio-media/asset.png",
  mime: "image/png",
  byte_size: png.length,
  width: 1,
  height: 1,
  alt: "Alt text",
};

function uploadRequest(fileName: string, type: string, bytes: Buffer = png) {
  const form = new FormData();
  form.set("alt", "Alt text");
  const fileBytes = new ArrayBuffer(bytes.length);
  new Uint8Array(fileBytes).set(bytes);
  form.set("file", new File([fileBytes], fileName, { type }));
  return new Request("https://example.test/api/studio/media", { method: "POST", body: form });
}

function deleteRequest() {
  return new Request("https://example.test/api/studio/media", {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id: asset.id }),
  });
}

beforeEach(() => {
  process.env.SUPABASE_URL = "https://storage.example";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  studioSession.mockResolvedValue(true);
  storageConfigured.mockReturnValue(true);
  insertMediaAsset.mockReset();
  listMediaAssets.mockReset();
  mediaUsageCount.mockReset();
  deleteMediaAsset.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("studio media API", () => {
  it("rejects SVG MIME types and extensions before storage upload", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const mimeResponse = await POST(uploadRequest("image.png", "image/svg+xml"));
    const extensionResponse = await POST(uploadRequest("image.SVG", "image/png"));
    expect(mimeResponse.status).toBe(422);
    expect(extensionResponse.status).toBe(422);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects SVG content even when filename and MIME claim PNG", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(uploadRequest("image.png", "image/png", Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')));
    expect(response.status).toBe(422);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("removes an uploaded object when metadata creation fails", async () => {
    insertMediaAsset.mockResolvedValue(null);
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(uploadRequest("image.png", "image/png"));
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body.error).toContain("uploaded object was removed");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain("studio-media/");
    expect(fetchMock.mock.calls[1][1].method).toBe("DELETE");
  });

  it("reports failed compensating cleanup without claiming the object was removed", async () => {
    insertMediaAsset.mockResolvedValue(null);
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(uploadRequest("image.png", "image/png"));
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body.error).toContain("cleanup of uploaded object");
    expect(body.error).toContain("may remain in storage");
  });

  it("retains metadata and returns an error if object deletion fails", async () => {
    listMediaAssets.mockResolvedValue([asset]);
    mediaUsageCount.mockResolvedValue(0);
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await DELETE(deleteRequest());
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body.error).toContain("metadata was retained");
    expect(deleteMediaAsset).not.toHaveBeenCalled();
  });

  it("surfaces metadata lookup failure rather than reporting a missing file or success", async () => {
    listMediaAssets.mockResolvedValue(null);
    const response = await DELETE(deleteRequest());
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body.ok).toBe(false);
    expect(body.error).toContain("metadata could not be read");
  });

  it("does not delete when usage checking fails", async () => {
    listMediaAssets.mockResolvedValue([asset]);
    mediaUsageCount.mockRejectedValue(new Error("offline"));
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await DELETE(deleteRequest());
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body.error).toContain("usage could not be checked");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(deleteMediaAsset).not.toHaveBeenCalled();
  });

  it("reports metadata deletion failure after object removal and supports a retry", async () => {
    listMediaAssets.mockResolvedValue([asset]);
    mediaUsageCount.mockResolvedValue(0);
    deleteMediaAsset.mockResolvedValue(false);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 404 })));
    const response = await DELETE(deleteRequest());
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body.error).toContain("metadata remains");
    expect(body.error).toContain("retrying this deletion is safe");
  });

  it("treats a repeated deletion of an absent metadata row as already complete", async () => {
    listMediaAssets.mockResolvedValue([]);
    const response = await DELETE(deleteRequest());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, alreadyDeleted: true });
  });
});
