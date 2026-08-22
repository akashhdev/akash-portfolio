"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ResumeEntry } from "@/lib/schemas";
import { ResumeVisual } from "@/components/resume-visual";

const sectionLabels: Record<ResumeEntry["section"], string> = {
  education: "Education",
  experience: "Experience",
  award: "Award & achievement",
  project: "Selected project",
};

export function ResumeEntryCollection({ entries }: { entries: ResumeEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = entries.find((entry) => entry.id === activeId);
  const closeButton = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  function currentHash() { return typeof window === "undefined" ? "" : window.location.hash; }

  function updatePreview(id: string | null) {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("preview", id);
    else url.searchParams.delete("preview");
    window.history.pushState(null, "", `${url.pathname}${url.search}${currentHash()}`);
    setActiveId(id);
  }

  function open(id: string, event: React.MouseEvent<HTMLElement>) {
    lastTrigger.current = event.currentTarget;
    updatePreview(id);
  }

  function close() {
    updatePreview(null);
  }

  useEffect(() => {
    function syncPreviewFromUrl() {
      setActiveId(new URLSearchParams(window.location.search).get("preview"));
    }
    syncPreviewFromUrl();
    window.addEventListener("popstate", syncPreviewFromUrl);
    return () => window.removeEventListener("popstate", syncPreviewFromUrl);
  }, []);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const drawer = document.querySelector<HTMLElement>("[data-preview-drawer]");
      const focusable = drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      lastTrigger.current?.focus();
    };
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="resume-entry-list">
        {entries.map((entry, index) => (
          <article className="resume-entry" key={entry.id} data-status={entry.status.toLowerCase()}>
            <button className="resume-entry-trigger" onClick={(event) => open(entry.id, event)} aria-haspopup="dialog">
              <span className="resume-entry-index mono">{String(index + 1).padStart(2, "0")}</span>
              <span className={`resume-status resume-status-${entry.status.toLowerCase()} mono`}>{entry.status}</span>
              <ResumeVisual visual={entry.visual} />
              <span className="resume-entry-copy">
                <strong>{entry.title}</strong>
                <span>{entry.organization}</span>
                <small>{entry.summary}</small>
              </span>
              <span className="resume-entry-meta"><span className="mono">{entry.dates}</span><span>{entry.location}</span>{entry.metric && <b>{entry.metric}</b>}</span>
              <span className="resume-entry-open" aria-hidden="true">↗</span>
            </button>
          </article>
        ))}
      </div>

      {active && (
        <div className="drawer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section className="preview-drawer" role="dialog" aria-modal="true" aria-labelledby="preview-title" data-preview-drawer>
            <div className="drawer-top"><span className="mono">Résumé detail / {active.dates}</span><button ref={closeButton} onClick={close} aria-label="Close preview">Close <span aria-hidden="true">×</span></button></div>
            <div className="drawer-body">
              <ResumeVisual visual={active.visual} expanded />
              <div className="drawer-labels"><p className="eyebrow mono">{sectionLabels[active.section]}</p><span className={`resume-status resume-status-${active.status.toLowerCase()} mono`}>{active.status}</span></div>
              <h2 id="preview-title">{active.title}</h2>
              <p className="drawer-org">{active.organization}<br />{active.location}</p>
              {active.preview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {active.metric && <p className="drawer-metric mono">Recorded result / {active.metric}</p>}
              <ul className="tag-list">{active.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
              {active.destination && <Link className="text-action" href={active.destination}>Read the complete record <span aria-hidden="true">→</span></Link>}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
