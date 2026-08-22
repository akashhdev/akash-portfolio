import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div><span className="mono">© {new Date().getFullYear()}</span><strong>Akash Raj Patel</strong><span>Graduate Research Engineer</span></div>
      <nav aria-label="Footer navigation">
        <a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href={site.twitter} target="_blank" rel="noreferrer">X / Twitter ↗</a>
        <Link href="/feed.xml">RSS</Link>
      </nav>
    </footer>
  );
}
