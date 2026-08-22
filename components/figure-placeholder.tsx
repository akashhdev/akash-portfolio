import type { MediaRecord } from "@/lib/schemas";

export function FigurePlaceholder({ record }: { record: MediaRecord }) {
  return (
    <figure className="media-request" aria-label={`Media requested: ${record.alt}`}>
      <div><span className="mono">Media request / {record.aspectRatio}</span><strong>{record.filename}</strong><p>{record.alt}</p></div>
      <figcaption>{record.caption} <em>Awaiting approved source media; this label is not a product screenshot.</em></figcaption>
    </figure>
  );
}
