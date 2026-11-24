import { MediaLibrary } from "@/components/studio/MediaLibrary";
import { storageConfigured } from "@/lib/studio";

export const dynamic = "force-dynamic";

export default function MediaPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-semibold">Media</h1>
      <p className="mt-3 text-sm leading-6 text-mid">
        JPEG, PNG, WebP, AVIF, and simple SVG. Alt text is required. If storage is not configured, articles can still be edited and saved.
      </p>
      <div className="mt-8">
        <MediaLibrary storageReady={storageConfigured()} />
      </div>
    </div>
  );
}
