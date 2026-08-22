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
