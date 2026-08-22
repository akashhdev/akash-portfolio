import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { mdxComponents } from "@/components/mdx-components";
import { getAllWriting, getWritingBySlug } from "@/lib/writing";
import { site } from "@/lib/site";

export function generateStaticParams() { return getAllWriting().map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getWritingBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.description, alternates: { canonical: `/writing/${post.slug}` }, openGraph: { type: "article", publishedTime: post.publishedAt, modifiedTime: post.updatedAt, url: `${site.url}/writing/${post.slug}` } };
}

export default async function WritingPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getWritingBySlug(slug);
  if (!post) notFound();
  return <main id="main"><div className="page-shell"><Breadcrumbs section="Writing" current={post.title} /><article className="article-shell"><p className="eyebrow mono">{post.series} / {post.publishedAt}</p><h1>{post.title}</h1><p className="lede">{post.description}</p><div className="prose"><MDXRemote source={post.body} components={mdxComponents} /></div>{post.citations.length > 0 && <ol className="citation-list">{post.citations.map((citation) => <li key={citation.url}><span>Source</span><a href={citation.url} target="_blank" rel="noreferrer">{citation.label} ↗</a></li>)}</ol>}</article></div></main>;
}
