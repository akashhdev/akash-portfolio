import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { writingPostSchema, type WritingPost } from "@/lib/schemas";

const writingDirectory = path.join(process.cwd(), "content", "writing");

export type WritingSource = WritingPost & { body: string };

export function getAllWriting({ includeDrafts = false } = {}): WritingSource[] {
  if (!fs.existsSync(writingDirectory)) return [];
  const sources = fs.readdirSync(writingDirectory)
    .filter((filename) => filename.endsWith(".mdx") && !filename.startsWith("_"))
    .map((filename) => {
      const source = fs.readFileSync(path.join(writingDirectory, filename), "utf8");
      const { data, content } = matter(source);
      return { ...writingPostSchema.parse(data), body: content };
    });
  const duplicateSlugs = sources.filter((post, index) => sources.findIndex((candidate) => candidate.slug === post.slug) !== index);
  if (duplicateSlugs.length) throw new Error(`Duplicate writing slugs: ${duplicateSlugs.map((post) => post.slug).join(", ")}`);
  return sources.filter((post) => includeDrafts || !post.draft).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getWritingBySlug(slug: string) {
  return getAllWriting().find((post) => post.slug === slug);
}
