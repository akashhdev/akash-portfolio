import { z } from "zod";

export const resumeEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  section: z.enum(["education", "experience", "award", "project"]),
  status: z.enum(["Current", "Incoming", "Completed"]),
  dates: z.string().min(2),
  sortDate: z.string().regex(/^\d{4}-\d{2}$/),
  title: z.string().min(2),
  organization: z.string().min(2),
  location: z.string().min(2),
  summary: z.string().min(20),
  preview: z.array(z.string().min(10)).min(1),
  skills: z.array(z.string()).min(1),
  destination: z.string().startsWith("/").optional(),
  metric: z.string().optional(),
  visual: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("logo"), key: z.enum(["ccu", "amity", "hiwin"]) }),
    z.object({ kind: z.literal("icon"), key: z.enum(["image-restoration", "style-transfer", "geospatial-3d"]) }),
  ]),
});

export const citationSchema = z.object({
  id: z.string(),
  label: z.string(),
  note: z.string(),
});

export const mediaRecordSchema = z.object({
  id: z.string(),
  filename: z.string(),
  aspectRatio: z.string(),
  minimumDimensions: z.string(),
  caption: z.string(),
  alt: z.string(),
  ownership: z.enum(["owned", "lab-permission-required", "third-party-permission-required"]),
  redactions: z.string(),
  status: z.enum(["required", "optional", "approved"]),
});

export const writingPostSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(3),
  description: z.string().min(20),
  series: z.enum(["Engineering Notes", "Paper Notes"]),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  tags: z.array(z.string()).min(1),
  hero: z.string().optional(),
  citations: z.array(z.object({ label: z.string(), url: z.string().url() })),
  draft: z.boolean(),
});

export type ResumeEntry = z.infer<typeof resumeEntrySchema>;
export type MediaRecord = z.infer<typeof mediaRecordSchema>;
export type WritingPost = z.infer<typeof writingPostSchema>;

export function validateUnique<T extends { id: string }>(records: T[], label: string) {
  const duplicates = records.filter((record, index) => records.findIndex((candidate) => candidate.id === record.id) !== index);
  if (duplicates.length) throw new Error(`Duplicate ${label} IDs: ${duplicates.map((item) => item.id).join(", ")}`);
  return records;
}
