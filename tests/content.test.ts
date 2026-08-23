import { describe, expect, it } from "vitest";
import { apps } from "../content/apps";
import { mediaManifest } from "../content/media";
import { projects } from "../content/projects";
import { resumeEntries } from "../content/resume";
import { getAllWriting } from "../lib/writing";
import { site } from "../lib/site";

describe("public content contracts", () => {
  it("keeps resume IDs unique and covers every public section", () => {
    expect(new Set(resumeEntries.map((entry) => entry.id)).size).toBe(resumeEntries.length);
    expect(new Set(resumeEntries.map((entry) => entry.section))).toEqual(new Set(["education", "experience", "award", "project"]));
    expect(resumeEntries.every((entry) => ["Current", "Incoming", "Completed"].includes(entry.status))).toBe(true);
    expect(resumeEntries.every((entry) => Boolean(entry.visual))).toBe(true);
  });

  it("assigns verified organization marks and project icons", () => {
    expect(resumeEntries.filter((entry) => entry.section !== "project").every((entry) => entry.visual.kind === "logo")).toBe(true);
    expect(resumeEntries.filter((entry) => entry.section === "project").every((entry) => entry.visual.kind === "icon")).toBe(true);
  });

  it("labels the future HIWIN placement as incoming", () => {
    const hiwin = resumeEntries.find((entry) => entry.id === "incoming-hiwin-fellow");
    expect(hiwin?.status).toBe("Incoming");
    expect(hiwin?.dates).toContain("2027");
    expect(hiwin?.preview.join(" ")).toContain("not current employment");
  });

  it("uses public professional links and a versioned résumé path", () => {
    expect(site.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\//);
    expect(site.resumePath).toBe("/resume/Akash-Raj-Patel-Resume-2026.pdf");
  });

  it("keeps apps and the historical project archive separate", () => {
    const projectTitles = projects.map((project) => project.title.toLowerCase());
    for (const app of apps) expect(projectTitles).not.toContain(app.name.toLowerCase());
  });

  it("keeps project demo mappings stable and valid", () => {
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
    const demos = projects.flatMap((project) => project.demos ?? []);
    const youtubeDemos = demos.filter((demo) => demo.source === "youtube");
    const videoDemos = demos.filter((demo) => demo.source === "video");
    expect(youtubeDemos.every((demo) => /^[A-Za-z0-9_-]{11}$/.test(demo.videoId))).toBe(true);
    expect(videoDemos.every((demo) => /^https:\/\/user-images\.githubusercontent\.com\/.+\.mp4$/.test(demo.url))).toBe(true);
    expect(youtubeDemos).toHaveLength(8);
    expect(videoDemos).toHaveLength(3);
    expect(new Set(demos.map((demo) => demo.source === "youtube" ? demo.videoId : demo.url)).size).toBe(11);
    expect(projects.find((project) => project.id === "bicep-curl-counter")?.year).toBe("2023");
    expect(projects.find((project) => project.id === "virtual-calculator")?.year).toBe("2023");
    expect(Object.fromEntries(projects.flatMap((project) => (project.demos ?? []).map((demo) => [demo.source === "youtube" ? demo.videoId : demo.url, project.id])))).toEqual({
      m7ln6uTDEbw: "arcgis-shapefiles-to-3d-models",
      R_dPeist9VI: "fast-neural-artistic-style-transfer",
      yz24zvuXmSY: "gesture-controlled-coffee-ordering",
      KobhezULv7I: "privacy-aware-face-blurring",
      b9UDZGF7Hx8: "coin-classification-and-counter",
      "https://user-images.githubusercontent.com/89295808/219943363-490ebd51-41c1-4cb1-8830-394e56ca9a5f.mp4": "gesture-cursor-and-keyboard",
      eI2WCGRazD0: "gesture-cursor-and-keyboard",
      "-pegHhLSizM": "gesture-cursor-and-keyboard",
      "https://user-images.githubusercontent.com/89295808/219944072-9eeac4dd-a998-403b-8787-0cdec011a4f3.mp4": "bicep-curl-counter",
      "https://user-images.githubusercontent.com/89295808/219943897-6fef7245-fe2b-4f43-aec9-639d59895e80.mp4": "virtual-calculator",
      pa_0tHsT2VY: "real-time-object-detection",
    });
    expect(projects.flatMap((project) => [project.repositoryUrl, ...(project.demos ?? []).map((demo) => demo.repositoryUrl)].filter(Boolean)).every((url) => url?.startsWith("https://github.com/akashhdev/"))).toBe(true);
  });

  it("provides expanded context, outcomes, and learnings for every project", () => {
    const projectsWithoutDemos = projects.filter((project) => !project.demos?.length);
    expect(projectsWithoutDemos.map((project) => project.id)).toEqual([
      "image-color-restoration",
      "boston-housing-analysis",
      "recession-and-housing-price-analysis",
      "movie-recommender",
      "sensor-and-arduino-experiments",
    ]);
    expect(projects.every((project) => project.details?.overview.length === 2)).toBe(true);
    expect(projects.every((project) => project.details?.outcomes.length === 2)).toBe(true);
    expect(projects.every((project) => project.details?.learnings.length === 2)).toBe(true);
  });

  it("requires explicit permission and redaction records for all research media", () => {
    for (const media of mediaManifest) {
      expect(media.ownership).toBeTruthy();
      expect(media.redactions.length).toBeGreaterThan(10);
      expect(media.minimumDimensions).toMatch(/×/);
    }
  });

  it("uses the public Disaster Response Digital Twin Model name", () => {
    const researchEntry = resumeEntries.find((entry) => entry.id === "tag-twin");
    expect(researchEntry?.summary).toContain("Disaster Response Digital Twin Model");
    expect(researchEntry?.summary).not.toMatch(/TAG[-–— ]?Twin/i);
    for (const media of mediaManifest) expect(`${media.caption} ${media.alt}`).not.toMatch(/TAG[-–— ]?Twin/i);
  });

  it("excludes drafts and templates from public writing", () => {
    expect(getAllWriting().every((post) => !post.draft)).toBe(true);
    expect(getAllWriting().some((post) => post.slug === "replace-with-slug")).toBe(false);
  });
});
