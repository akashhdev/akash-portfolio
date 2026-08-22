"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelector = [
  ".professional-portrait",
  ".introduction-copy > *",
  ".resume-document-section:not(.resume-introduction) .section-heading",
  ".resume-entry",
  ".resume-section-action",
  ".page-hero > *",
  ".section > *",
].join(",");

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = [...document.querySelectorAll<HTMLElement>(revealSelector)];
    elements.forEach((element, index) => {
      element.dataset.reveal = "";
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      elements.forEach((element) => { element.dataset.revealVisible = ""; });
      return;
    }

    let observer: IntersectionObserver | undefined;
    const frame = window.requestAnimationFrame(() => {
      document.documentElement.classList.add("reveal-ready");
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.revealVisible = "";
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });
      elements.forEach((element) => observer?.observe(element));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      document.documentElement.classList.remove("reveal-ready");
      elements.forEach((element) => {
        delete element.dataset.reveal;
        delete element.dataset.revealVisible;
        element.style.removeProperty("--reveal-delay");
      });
    };
  }, [pathname]);

  return null;
}
