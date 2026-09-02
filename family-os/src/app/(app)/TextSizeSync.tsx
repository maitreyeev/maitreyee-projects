"use client";

import { useEffect } from "react";

const STORAGE_KEY = "familyos-text-size";

/** Applies the viewer's saved text-size preference on every page load —
 *  a small, non-blocking client-side sync instead of a root-layout
 *  <script>, which this Next.js version's dev renderer doesn't handle
 *  well outside <head>. Costs a brief flash for "large" users on first
 *  paint, which is an acceptable trade for reliability. */
export default function TextSizeSync() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      document.documentElement.dataset.textSize = stored === "large" ? "large" : "";
    } catch {
      // localStorage unavailable — stay at default.
    }
  }, []);

  return null;
}
