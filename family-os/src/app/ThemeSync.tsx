"use client";

import { useEffect } from "react";

const STORAGE_KEY = "familyos-theme";

/** Applies the viewer's saved appearance preference on every page load.
 *  Same trade-off as TextSizeSync: a brief flash on first paint instead
 *  of a root <script>, which this Next.js version's dev renderer doesn't
 *  handle well outside <head>. */
export default function ThemeSync() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") {
        document.documentElement.dataset.theme = stored;
        document.documentElement.style.colorScheme = stored;
      } else {
        delete document.documentElement.dataset.theme;
        document.documentElement.style.colorScheme = "light dark";
      }
    } catch {
      // localStorage unavailable — stay at system default.
    }
  }, []);

  return null;
}
