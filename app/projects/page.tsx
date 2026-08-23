import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProjectArchive } from "@/components/project-archive";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Applied Project Archive", description: "Older computer-vision, machine-learning, data, API, and hardware projects.", alternates: { canonical: "/projects" } };

export default function ProjectsPage() {
  return <main id="main"><div className="page-shell"><Breadcrumbs section="Supporting work" current="Projects" /><header className="page-hero"><div><p className="eyebrow mono">Applied archive / 2021—2024</p><h1>Experiments that<br /><em>built fluency.</em></h1></div><p className="lede">Earlier computer-vision, machine-learning, API, data, and hardware work. This archive records technical range without presenting classroom experiments as graduate research.</p></header><ProjectArchive projects={projects} /></div></main>;
}
