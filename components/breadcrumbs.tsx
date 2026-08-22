import Link from "next/link";

export function Breadcrumbs({ section, current }: { section: string; current: string }) {
  return <nav className="breadcrumbs mono" aria-label="Breadcrumb"><Link href="/">Index</Link><span>/</span><span>{section}</span><span>/</span><span aria-current="page">{current}</span></nav>;
}
