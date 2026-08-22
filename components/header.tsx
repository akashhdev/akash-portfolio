"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Award, BriefcaseBusiness, Download, ExternalLink, FolderKanban, GraduationCap, Menu, Microscope, PanelsTopLeft, PenLine, UserRound } from "lucide-react";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

const sections = [
  { id: "introduction", label: "Introduction", icon: UserRound },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "awards", label: "Awards", icon: Award },
  { id: "projects", label: "Projects", icon: FolderKanban },
] as const;

const globalRoutes = [
  { href: "/research/tag-twin", label: "Research", icon: Microscope },
  { href: "/apps", label: "Apps", icon: PanelsTopLeft },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/writing", label: "Research Blog", icon: PenLine },
] as const;

const externalRoutes = [
  { href: site.github, label: "GitHub", icon: ExternalLink },
  { href: site.linkedin, label: "LinkedIn", icon: ExternalLink },
  { href: site.twitter, label: "X / Twitter", icon: ExternalLink },
] as const;

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeSection, setActiveSection] = useState("introduction");
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileOpenRef = useRef(false);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  function updateMobileNavigation(open: boolean) {
    mobileOpenRef.current = open;
    setMobileOpen(open);
  }

  useEffect(() => {
    if (!isHome) return;
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((target): target is HTMLElement => Boolean(target));
    if (!targets.length) return;
    function updateActiveSection() {
      const activationLine = Math.min(window.innerHeight * 0.38, 340);
      const documentActivationPoint = window.scrollY + activationLine;
      const current = [...targets]
        .reverse()
        .find((target) => target.getBoundingClientRect().top + window.scrollY <= documentActivationPoint)
        ?? targets[0];
      if (current?.id) setActiveSection(current.id);
    }
    function activateHashTarget() {
      const hashTarget = window.location.hash.slice(1);
      if (sections.some((section) => section.id === hashTarget)) setActiveSection(hashTarget);
      else updateActiveSection();
    }
    const observer = new IntersectionObserver(updateActiveSection, { rootMargin: "0px 0px -60% 0px", threshold: [0, 0.01] });
    targets.forEach((target) => observer.observe(target));
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("hashchange", activateHashTarget);
    window.requestAnimationFrame(updateActiveSection);
    const settleTimer = window.setTimeout(activateHashTarget, 350);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", activateHashTarget);
      window.clearTimeout(settleTimer);
    };
  }, [isHome]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileCloseRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") updateMobileNavigation(false);
      if (event.key !== "Tab") return;
      const drawer = document.querySelector<HTMLElement>("[data-mobile-navigation]");
      const focusable = drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      mobileTriggerRef.current?.focus();
    };
  }, [mobileOpen]);

  useEffect(() => { mobileOpenRef.current = mobileOpen; }, [mobileOpen]);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let tracking = false;
    function onPointerDown(event: PointerEvent) {
      if (!window.matchMedia("(max-width: 900px)").matches) return;
      if (!mobileOpenRef.current && event.clientX > 24) return;
      startX = event.clientX;
      startY = event.clientY;
      tracking = true;
    }
    function onPointerUp(event: PointerEvent) {
      if (!tracking) return;
      tracking = false;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      if (Math.abs(deltaY) > Math.abs(deltaX) || Math.abs(deltaX) < 64) return;
      if (!mobileOpenRef.current && deltaX > 0) updateMobileNavigation(true);
      if (mobileOpenRef.current && deltaX < 0) updateMobileNavigation(false);
    }
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerup", onPointerUp, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  function closeMobileNavigation() { updateMobileNavigation(false); }

  return (
    <header className={`site-header ${isHome ? "site-header-resume" : "site-header-global"}`}>
      <Link className="wordmark" href="/" aria-label="Akash Raj Patel, homepage"><span className="wordmark-name">Akash</span><span className="wordmark-domain">.tw</span></Link>

      <nav className="desktop-primary-nav" aria-label={isHome ? "Résumé sections" : "Primary navigation"}>
        {isHome ? sections.map((section) => {
          const Icon = section.icon;
          return <a key={section.id} href={`/#${section.id}`} aria-current={activeSection === section.id ? "location" : undefined}><Icon aria-hidden="true" /><span>{section.label}</span></a>;
        }) : globalRoutes.map((route) => {
          const Icon = route.icon;
          return <Link key={route.href} href={route.href}><Icon aria-hidden="true" /><span>{route.label}</span></Link>;
        })}
      </nav>

      <div className="header-actions">
        <Link className="research-blog-link" href="/writing"><PenLine aria-hidden="true" /><span>Research Blog</span></Link>
        <ThemeToggle compact />
        <a className="resume-download" href={site.resumePath} download><Download aria-hidden="true" /><span className="download-full">Download résumé</span><span className="download-short">Résumé</span></a>
        <button ref={mobileTriggerRef} className="mobile-menu-trigger" type="button" aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => updateMobileNavigation(true)}><Menu aria-hidden="true" /><span>Menu</span></button>
      </div>

      {mobileOpen && <div className="mobile-nav-layer" onPointerDown={(event) => { if (event.target === event.currentTarget) updateMobileNavigation(false); }}>
        <nav className="mobile-navigation" id="mobile-navigation" data-mobile-navigation aria-label="Mobile navigation">
          <div className="mobile-nav-top"><span className="mono">Navigation / 05</span><button ref={mobileCloseRef} type="button" onClick={() => updateMobileNavigation(false)} aria-label="Close navigation">Close <span aria-hidden="true">×</span></button></div>
          <div className="mobile-section-links">{sections.map((section, index) => { const Icon = section.icon; return <a key={section.id} href={`/#${section.id}`} aria-current={isHome && activeSection === section.id ? "location" : undefined} onClick={closeMobileNavigation}><span className="mono">{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /><span>{section.label}</span></a>; })}</div>
          <div className="mobile-theme-row"><ThemeToggle /></div>
          <div className="mobile-global-links">{globalRoutes.filter((route) => route.href !== "/projects").map((route) => { const Icon = route.icon; return <Link key={route.href} href={route.href} onClick={closeMobileNavigation}><Icon aria-hidden="true" />{route.label}</Link>; })}{externalRoutes.map((route) => { const Icon = route.icon; return <a key={route.href} href={route.href} target="_blank" rel="noreferrer" onClick={closeMobileNavigation}><Icon aria-hidden="true" />{route.label} ↗</a>; })}</div>
        </nav>
      </div>}
    </header>
  );
}
