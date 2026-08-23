"use client";

import { useEffect, useRef, useState } from "react";
import type { Project, ProjectDemo } from "@/content/projects";

const projectParameter = "project";

type YouTubePlayer = {
  mute: () => void;
};

type YouTubePlayerApi = {
  Player: new (iframe: HTMLIFrameElement, options: { events: { onReady: (event: { target: YouTubePlayer }) => void } }) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubePlayerApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubePlayerApi> | null = null;

function loadYouTubePlayerApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();
      if (window.YT) resolve(window.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

function MutedYouTubePlayer({ projectTitle, demoTitle, videoId }: { projectTitle: string; demoTitle: string; videoId: string }) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const origin = typeof window === "undefined" ? "" : encodeURIComponent(window.location.origin);

  useEffect(() => {
    let cancelled = false;
    loadYouTubePlayerApi().then((api) => {
      if (cancelled || !iframe.current) return;
      new api.Player(iframe.current, {
        events: { onReady: (event) => event.target.mute() },
      });
    });
    return () => { cancelled = true; };
  }, [videoId]);

  return (
    <iframe
      ref={iframe}
      src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&playsinline=1&origin=${origin}`}
      title={`${projectTitle}: ${demoTitle} video demo`}
      loading="lazy"
      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}

function ProjectDemoPlayer({ projectTitle, demo }: { projectTitle: string; demo: ProjectDemo }) {
  if (demo.source === "youtube") {
    return <MutedYouTubePlayer projectTitle={projectTitle} demoTitle={demo.title} videoId={demo.videoId} />;
  }

  return (
    <video controls muted playsInline preload="metadata" aria-label={`${projectTitle}: ${demo.title} video demo`}>
      <source src={demo.url} type="video/mp4" />
      Your browser does not support embedded video. <a href={demo.url}>Open the demo video</a>.
    </video>
  );
}

export function ProjectArchive({ projects }: { projects: readonly Project[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDemoTitle, setActiveDemoTitle] = useState<string | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const active = projects.find((project) => project.id === activeId);
  const activeDemo = active?.demos?.find((demo) => demo.title === activeDemoTitle) ?? active?.demos?.[0];
  const activeRepositoryUrl = activeDemo?.repositoryUrl ?? active?.repositoryUrl;

  function setProjectInUrl(project: Project | null) {
    const url = new URL(window.location.href);
    if (project) url.searchParams.set(projectParameter, project.id);
    else url.searchParams.delete(projectParameter);
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
    setActiveId(project?.id ?? null);
    setActiveDemoTitle(project?.demos?.[0]?.title ?? null);
  }

  function open(project: Project, trigger: HTMLButtonElement) {
    lastTrigger.current = trigger;
    setProjectInUrl(project);
  }

  function close() {
    setProjectInUrl(null);
  }

  useEffect(() => {
    function syncProjectFromUrl() {
      const id = new URLSearchParams(window.location.search).get(projectParameter);
      const project = projects.find((candidate) => candidate.id === id);
      setActiveId(project?.id ?? null);
      setActiveDemoTitle(project?.demos?.[0]?.title ?? null);
    }

    syncProjectFromUrl();
    window.addEventListener("popstate", syncProjectFromUrl);
    return () => window.removeEventListener("popstate", syncProjectFromUrl);
  }, [projects]);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const drawer = document.querySelector<HTMLElement>("[data-project-preview-drawer]");
      const focusable = drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe, video, [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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
      <section className="section editorial-list" aria-label="Project archive">
        {projects.map((project, index) => {
          const hasDemos = Boolean(project.demos?.length);
          return (
            <article className="editorial-row project-row project-row-interactive" key={project.id} data-project-id={project.id}>
              <span className="mono">{String(index + 1).padStart(2, "0")} / {project.year}</span>
              <div>
                <span className="app-type mono">{project.area}</span>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
              </div>
              <ul>{project.skills.map((item) => <li key={item}>{item}</li>)}</ul>
              <span className="project-row-action mono" aria-hidden="true"><span>{hasDemos ? "View demo" : "View details"}</span><b>↗</b></span>
              <button className="project-row-trigger" type="button" aria-haspopup="dialog" onClick={(event) => open(project, event.currentTarget)}>
                <span className="sr-only">{hasDemos ? "View demo" : "View details"} for {project.title}</span>
              </button>
            </article>
          );
        })}
      </section>

      {active && (
        <div className="drawer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section className="preview-drawer project-preview-drawer" role="dialog" aria-modal="true" aria-labelledby="project-preview-title" data-project-preview-drawer>
            <div className="drawer-top">
              <span className="mono">Project {activeDemo ? "demo" : "details"} / {active.year}</span>
              <button ref={closeButton} onClick={close} aria-label="Close project details">Close <span aria-hidden="true">×</span></button>
            </div>
            <div className="drawer-body project-drawer-body">
              <p className="eyebrow mono">{active.area}</p>
              <h2 id="project-preview-title">{active.title}</h2>
              <p className="project-drawer-summary">{active.summary}</p>

              {activeDemo && active.demos && active.demos.length > 1 && (
                <div className="project-demo-selector" role="group" aria-label="Choose a project demo">
                  {active.demos.map((demo) => (
                    <button key={demo.title} type="button" aria-pressed={demo.title === activeDemo.title} onClick={() => setActiveDemoTitle(demo.title)}>
                      {demo.title}
                    </button>
                  ))}
                </div>
              )}

              {activeDemo && (
                <div className="project-video-frame">
                  <ProjectDemoPlayer key={activeDemo.title} projectTitle={active.title} demo={activeDemo} />
                </div>
              )}

              {active.details && (
                <div className="project-detail-sections">
                  <section aria-labelledby="project-overview-title">
                    <h3 id="project-overview-title">Project context</h3>
                    {active.details.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </section>
                  <section aria-labelledby="project-outcomes-title">
                    <h3 id="project-outcomes-title">Results &amp; outcomes</h3>
                    <ul>{active.details.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
                  </section>
                  <section aria-labelledby="project-learnings-title">
                    <h3 id="project-learnings-title">Key learnings</h3>
                    <ul>{active.details.learnings.map((learning) => <li key={learning}>{learning}</li>)}</ul>
                  </section>
                </div>
              )}

              <ul className="tag-list">{active.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
              <div className="project-drawer-actions">
                {activeDemo && (
                  <a className="text-action" href={activeDemo.source === "youtube" ? `https://www.youtube.com/watch?v=${activeDemo.videoId}` : activeDemo.url} target="_blank" rel="noreferrer">
                    {activeDemo.source === "youtube" ? `Watch ${activeDemo.title} on YouTube` : `Open ${activeDemo.title} video`} <span aria-hidden="true">↗</span>
                  </a>
                )}
                {activeRepositoryUrl && (
                  <a className="text-action" href={activeRepositoryUrl} target="_blank" rel="noreferrer">
                    View source on GitHub <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
