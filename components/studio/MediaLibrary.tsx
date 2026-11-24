"use client";

import { useEffect, useState } from "react";
import { brandAssets, formatBytes } from "@/lib/studio-media";
import { buttonClass } from "@/components/ui/primitives";

type Asset = {
  id: string;
  public_url: string;
  mime: string;
  byte_size: number;
  width: number | null;
  height: number | null;
  alt: string;
  sizeLabel?: string;
};

export function MediaLibrary({ storageReady }: { storageReady: boolean }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [message, setMessage] = useState(storageReady ? "" : "Media storage is not configured. You can still edit and save articles.");
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!storageReady) return;
    void fetch("/api/studio/media/")
      .then((res) => res.json())
      .then((body: { ok?: boolean; assets?: Asset[]; error?: string }) => {
        if (!body.ok) setMessage(body.error || "Media could not be loaded. Editing still works.");
        else setAssets(body.assets ?? []);
      })
      .catch(() => setMessage("Media could not be loaded. Editing still works."));
  }, [storageReady]);

  async function upload() {
    if (!file) return;
    const form = new FormData();
    form.set("alt", alt);
    form.set("file", file);
    const res = await fetch("/api/studio/media/", { method: "POST", body: form });
    const body = (await res.json()) as { ok?: boolean; error?: string; asset?: Asset };
    if (!res.ok || !body.ok || !body.asset) {
      setMessage(body.error || "The file was not stored. You can still edit and save articles.");
      return;
    }
    setAssets((current) => [body.asset as Asset, ...current]);
    setAlt("");
    setFile(null);
    setMessage("Uploaded. Paste the URL into the hero field on an article.");
  }

  async function remove(id: string) {
    const res = await fetch("/api/studio/media/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const body = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !body.ok) {
      setMessage(body.error || "The file was not deleted.");
      return;
    }
    setAssets((current) => current.filter((asset) => asset.id !== id));
    setMessage("Deleted.");
  }

  return (
    <div className="space-y-8">
      {message ? <p className="text-sm leading-6 text-mid">{message}</p> : null}
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void upload();
        }}
      >
        <label className="block text-sm font-semibold">
          Alt text
          <input className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-ink px-3" value={alt} onChange={(event) => setAlt(event.target.value)} required />
        </label>
        <label className="block text-sm font-semibold">
          Image file
          <input
            className="mt-2 block w-full text-sm"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
        <button className={buttonClass("primary")} type="submit" disabled={!storageReady}>
          Upload
        </button>
      </form>
      <ul className="space-y-4">
        {assets.map((asset) => (
          <li key={asset.id} className="rounded-lg border border-white/10 p-3 text-sm leading-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.public_url}
              alt={asset.alt}
              width={asset.width ?? undefined}
              height={asset.height ?? undefined}
              className="mb-3 max-h-40 w-auto"
            />
            <p>{asset.alt}</p>
            <p className="text-mid">
              {asset.sizeLabel || formatBytes(asset.byte_size)}
              {asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ""}
            </p>
            <p className="break-all text-mid">{asset.public_url}</p>
            <button type="button" className={`${buttonClass("secondary")} mt-2`} onClick={() => void remove(asset.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <section>
        <h2 className="text-xl font-semibold">Existing brand files</h2>
        <p className="mt-2 text-sm leading-6 text-mid">Use these paths as a hero image. They are the files already in the site. No new logos are generated.</p>
        <ul className="mt-4 space-y-2 text-sm">
          {brandAssets.map((asset) => (
            <li key={asset.path}>
              {asset.label}: <span className="text-mid">{asset.path}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
