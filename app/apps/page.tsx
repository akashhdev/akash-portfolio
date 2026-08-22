import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { apps } from "@/content/apps";

export const metadata: Metadata = { title: "Apps & Operated Systems", description: "Authored products and customized self-hosted systems by Akash Raj Patel.", alternates: { canonical: "/apps" } };

export default function AppsPage() {
  return <main id="main"><div className="page-shell"><Breadcrumbs section="Supporting work" current="Apps" /><header className="page-hero"><div><p className="eyebrow mono">Product record / separate from lab research</p><h1>Software built<br />and <em>operated.</em></h1></div><p className="lede">Authored products and customized platforms, kept distinct so infrastructure and product work never blur the boundaries of the graduate-lab record.</p></header><p className="index-note">These systems demonstrate product judgment, integration, deployment, and long-term maintenance. “Authored” and “customized” are stated explicitly.</p><section className="section editorial-list" aria-label="Application directory">{apps.map((app, index) => <article className="editorial-row" id={app.slug} key={app.slug}><span className="mono">{String(index + 1).padStart(2, "0")} / {app.status}</span><div><span className="app-type mono">{app.kind}</span><h2>{app.name}</h2><p>{app.summary}</p><p style={{ marginTop: "1rem", color: "var(--ink)" }}><strong>Contribution:</strong> {app.contribution}</p>{app.credit && <p className="credit">Platform credit / {app.credit}</p>}</div><ul>{app.stack.map((item) => <li key={item}>{item}</li>)}</ul><a href={app.url} target="_blank" rel="noreferrer" aria-label={`Open ${app.name}`}>↗</a></article>)}</section></div></main>;
}
