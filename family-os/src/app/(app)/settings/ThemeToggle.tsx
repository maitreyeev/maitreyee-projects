"use client";

import { useEffect, useState } from "react";
import { SunMoon } from "lucide-react";
import Card from "@/components/Card";

const STORAGE_KEY = "familyos-theme";
type Theme = "system" | "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount, not a render-triggered cascade
        setTheme(stored);
      }
    } catch {
      // localStorage unavailable (private browsing, etc.) — stay at system default.
    }
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    const html = document.documentElement;
    if (next === "system") {
      // eslint-disable-next-line react-hooks/immutability -- intentional DOM side effect from a user click, not a render-path mutation
      delete html.dataset.theme;
      // eslint-disable-next-line react-hooks/immutability -- intentional DOM side effect from a user click, not a render-path mutation
      html.style.colorScheme = "light dark";
    } else {
      // eslint-disable-next-line react-hooks/immutability -- intentional DOM side effect from a user click, not a render-path mutation
      html.dataset.theme = next;
      // eslint-disable-next-line react-hooks/immutability -- intentional DOM side effect from a user click, not a render-path mutation
      html.style.colorScheme = next;
    }
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Best effort only.
    }
  }

  return (
    <Card className="p-5 flex items-center gap-3">
      <SunMoon size={18} className="text-accent shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-extrabold">Appearance</h3>
        <p className="text-xs text-muted">Light, dark, or match this device.</p>
      </div>
      <div className="flex rounded-full bg-surface-muted p-1 shrink-0">
        {(["system", "light", "dark"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => apply(opt)}
            className={`px-3 h-8 rounded-full text-xs font-bold cursor-pointer transition-colors capitalize ${
              theme === opt ? "bg-ink text-ink-foreground" : "text-muted"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </Card>
  );
}
