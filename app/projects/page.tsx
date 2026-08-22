import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Applied Project Archive", description: "Older computer-vision, machine-learning, data, API, and hardware projects.", alternates: { canonical: "/projects" } };

export default function ProjectsPage() {
  return <main id="main"><div className="page-shell"><Breadcrumbs section="Supporting work" current="Projects" /><header className="page-hero"><div><p className="eyebrow mono">Applied archive / 2021—2024</p><h1>Experiments that<br /><em>built fluency.</em></h1></div><p className="lede">Earlier computer-vision, machine-learning, API, data, and hardware work. This archive records technical range without presenting classroom experiments as graduate research.</p></header><section className="section editorial-list" aria-label="Project archive">{projects.map((project, index) => <article className="editorial-row" key={project.title}><span className="mono">{String(index + 1).padStart(2, "0")} / {project.year}</span><div><span className="app-type mono">{project.area}</span><h2>{project.title}</h2><p>{project.summary}</p></div><ul>{project.skills.map((item) => <li key={item}>{item}</li>)}</ul><span aria-hidden="true">—</span></article>)}</section></div></main>;
}
