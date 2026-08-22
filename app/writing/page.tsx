import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAllWriting } from "@/lib/writing";

export const metadata: Metadata = { title: "Writing", description: "Engineering notes and critical readings from Akash Raj Patel.", alternates: { canonical: "/writing" } };

export default function WritingPage() {
  const posts = getAllWriting();
  return <main id="main"><div className="page-shell"><Breadcrumbs section="Publication" current="Writing" /><header className="page-hero"><div><p className="eyebrow mono">Two series / evidence over cadence</p><h1>Notes from<br /><em>building & reading.</em></h1></div><p className="lede">Engineering Notes examine systems I build. Paper Notes make a recurring practice of summarizing, critiquing, and reflecting on research literature.</p></header><section className="section">{posts.length ? <div className="editorial-list">{posts.map((post, index) => <Link href={`/writing/${post.slug}`} className="editorial-row" key={post.slug}><span className="mono">{String(index + 1).padStart(2, "0")} / {post.publishedAt}</span><div><span className="app-type mono">{post.series}</span><h2>{post.title}</h2><p>{post.description}</p></div><ul>{post.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul><span>→</span></Link>)}</div> : <div className="draft-empty"><p className="eyebrow mono">Publication record</p><h2>No public notes yet.</h2><p>The editorial system is ready. Draft templates remain private and are deliberately excluded from this index, routes, RSS, and metadata.</p></div>}</section></div></main>;
}
