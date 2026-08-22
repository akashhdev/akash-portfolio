"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const storageKey = "akash-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#0A0A0B" : "#FFFFFF";
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>();

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const stored = window.localStorage.getItem(storageKey);
      const next: Theme = stored === "light" || stored === "dark" ? stored : media.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  function toggleTheme() {
    const current = (document.documentElement.dataset.theme === "dark" ? "dark" : "light") satisfies Theme;
    const next: Theme = current === "dark" ? "light" : "dark";
    window.localStorage.setItem(storageKey, next);
    applyTheme(next);
    setTheme(next);
  }

  const target = theme === "dark" ? "day" : "night";
  return (
    <button className={`theme-toggle${compact ? " theme-toggle-compact" : ""}`} type="button" onClick={toggleTheme} aria-label={`Switch to ${target} theme`} title={`Switch to ${target} theme`}>
      <Sun className="theme-icon theme-icon-sun" aria-hidden="true" />
      <Moon className="theme-icon theme-icon-moon" aria-hidden="true" />
      {!compact && <span>Theme</span>}
    </button>
  );
}
