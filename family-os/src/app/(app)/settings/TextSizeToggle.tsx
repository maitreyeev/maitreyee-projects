"use client";

import { useEffect, useState } from "react";
import { Type } from "lucide-react";
import Card from "@/components/Card";

const STORAGE_KEY = "familyos-text-size";

export default function TextSizeToggle() {
  const [size, setSize] = useState<"normal" | "large">("normal");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount, not a render-triggered cascade
      if (stored === "large") setSize("large");
    } catch {
      // localStorage unavailable (private browsing, etc.) — stay at default.
    }
  }, []);

  function apply(next: "normal" | "large") {
    setSize(next);
    // eslint-disable-next-line react-hooks/immutability -- intentional DOM side effect from a user click, not a render-path mutation
    document.documentElement.dataset.textSize = next === "large" ? "large" : "";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Best effort only.
    }
  }

  return (
    <Card className="p-5 flex items-center gap-3">
      <Type size={18} className="text-accent shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-extrabold">Text size</h3>
        <p className="text-xs text-muted">Bigger text for this device, easier reading.</p>
      </div>
      <div className="flex rounded-full bg-surface-muted p-1 shrink-0">
        {(["normal", "large"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => apply(opt)}
            className={`px-3 h-8 rounded-full text-xs font-bold cursor-pointer transition-colors capitalize ${
              size === opt ? "bg-ink text-ink-foreground" : "text-muted"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </Card>
  );
}
