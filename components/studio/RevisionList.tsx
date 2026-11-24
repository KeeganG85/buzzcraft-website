import { johannesburgLabel } from "@/lib/studio-time";

export function RevisionList({
  revisions,
}: {
  revisions: { version_number: number; approval_status: string; created_at: string; revision_notes: string }[];
}) {
  return (
    <div className="space-y-2 border-t border-white/10 pt-4">
      <h3 className="text-sm font-semibold">Revisions</h3>
      {revisions.length === 0 ? <p className="text-sm text-mid">No saved versions yet.</p> : null}
      <ul className="space-y-2">
        {revisions.map((revision) => (
          <li key={`${revision.version_number}-${revision.created_at}`} className="text-sm leading-6">
            <span className="font-semibold">Version {revision.version_number}</span> {revision.approval_status}.{" "}
            {johannesburgLabel(revision.created_at)} SAST. {revision.revision_notes || "No note."}
          </li>
        ))}
      </ul>
    </div>
  );
}
