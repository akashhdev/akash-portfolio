export interface AppRecord {
  slug: string;
  name: string;
  kind: string;
  status: string;
  url: string;
  summary: string;
  contribution: string;
  stack: readonly string[];
  credit?: string;
}

export const apps: readonly AppRecord[] = [
  { slug: "langx", name: "LangX", kind: "Authored product", status: "Live", url: "https://lang.akash.tw", summary: "AI-assisted Mandarin learning through flashcards, reading, listening, grammar practice, generated exercises, progress tracking, and educator sharing.", contribution: "Product concept, interaction design, full-stack engineering, AI-assisted learning flows, deployment, and ongoing operation.", stack: ["TypeScript", "React", "AI-assisted practice", "PWA"] },
  { slug: "taskx", name: "TaskX", kind: "Authored product", status: "Live", url: "https://task.akash.tw", summary: "Task and project planning connected to Pomodoro-style focus sessions, reusable templates, tags, reports, and synchronized progress.", contribution: "Product design, planning and focus models, reporting interface, application engineering, integration, and deployment.", stack: ["TypeScript", "React", "Focus analytics", "Product engineering"] },
  { slug: "planx", name: "PlanX", kind: "Authored product", status: "Live", url: "https://plan.akash.tw", summary: "A TaskX-connected calendar that turns scheduled events and tasks into focused work and shared progress.", contribution: "Calendar interaction model, TaskX integration, responsive PWA experience, product engineering, and deployment.", stack: ["Calendar systems", "PWA", "TaskX integration", "Product design"] },
  { slug: "photosx", name: "PhotosX", kind: "Customized platform", status: "Private", url: "https://photos.akash.tw", summary: "A private, customized Immich deployment centered on photo ownership, organization, branding, storage, and self-hosted operations.", contribution: "Infrastructure design, deployment, branding, access configuration, storage stewardship, updates, and ongoing operations.", stack: ["Immich", "Self-hosting", "Private storage", "Operations"], credit: "PhotosX is a customized private deployment powered by the open-source Immich platform." },
  { slug: "watchx", name: "WatchX", kind: "Customized platform", status: "Private", url: "https://watch.akash.tw", summary: "A private Jellyfin deployment for personal media access, library management, cross-device playback, branding, and server operations.", contribution: "Server deployment, secure access, library organization, custom identity, maintenance, and the surrounding self-hosted stack.", stack: ["Jellyfin", "Self-hosting", "Media server", "Operations"], credit: "WatchX is a customized private deployment powered by the open-source Jellyfin media system." },
];
