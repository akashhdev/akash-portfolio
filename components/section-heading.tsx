export function SectionHeading({ id, number, eyebrow, title, description, variant = "editorial" }: { id?: string; number: string; eyebrow: string; title: string; description?: string; variant?: "editorial" | "resume" }) {
  if (variant === "resume") {
    return (
      <header className="section-heading section-heading-resume">
        <h2 id={id}><span>{number}</span>{" "}{eyebrow}</h2>
        <p><strong>{title}</strong>{description && <> {description}</>}</p>
      </header>
    );
  }

  return (
    <header className="section-heading">
      <div className="section-label mono"><span>{number}</span><span>{eyebrow}</span></div>
      <h2 id={id}>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  );
}
