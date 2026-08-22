import Image from "next/image";
import { Boxes, ImagePlus, Paintbrush } from "lucide-react";
import type { ResumeEntry } from "@/lib/schemas";

const logos = {
  ccu: { src: "/media/organizations/ccu-logo.png", width: 341, height: 82, label: "National Chung Cheng University" },
  amity: { src: "/media/organizations/amity-logo.webp", width: 263, height: 73, label: "Amity University Mumbai" },
  hiwin: { src: "/media/organizations/hiwin-logo.svg", width: 122, height: 24, label: "HIWIN Technologies" },
} as const;

const projectIcons = {
  "image-restoration": ImagePlus,
  "style-transfer": Paintbrush,
  "geospatial-3d": Boxes,
} as const;

export function ResumeVisual({ visual, expanded = false }: { visual: ResumeEntry["visual"]; expanded?: boolean }) {
  if (visual.kind === "logo") {
    const logo = logos[visual.key];
    return (
      <span className={`resume-visual resume-visual-logo${expanded ? " resume-visual-expanded" : ""}`} title={logo.label}>
        <Image src={logo.src} width={logo.width} height={logo.height} alt="" sizes={expanded ? "160px" : "96px"} unoptimized={logo.src.endsWith(".svg")} />
      </span>
    );
  }

  const Icon = projectIcons[visual.key];
  return <span className={`resume-visual resume-visual-icon${expanded ? " resume-visual-expanded" : ""}`} aria-hidden="true"><Icon strokeWidth={1.5} /></span>;
}
