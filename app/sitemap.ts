import type { MetadataRoute } from "next";
import { getAllWriting } from "@/lib/writing";
import { site } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap { const routes = ["", "/research/tag-twin", "/experience/ai-sustainability-internship", "/apps", "/projects", "/writing"]; const staticPages = routes.map((route) => ({ url: `${site.url}${route}`, lastModified: new Date("2026-08-22"), changeFrequency: route === "" ? "monthly" as const : "yearly" as const, priority: route === "" ? 1 : route.includes("tag-twin") ? .9 : .7 })); return [...staticPages, ...getAllWriting().map((post) => ({ url: `${site.url}/writing/${post.slug}`, lastModified: new Date(post.updatedAt ?? post.publishedAt), changeFrequency: "yearly" as const, priority: .6 }))]; }
