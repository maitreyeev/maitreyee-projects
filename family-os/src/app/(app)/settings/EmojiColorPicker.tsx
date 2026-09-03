"use client";

import { Check } from "lucide-react";
import Avatar from "@/components/Avatar";

export const EMOJIS = ["👨🏽", "👩🏽", "👴🏽", "👵🏽", "👦🏽", "👧🏽", "🧑🏽", "👶🏽"];
export const COLORS = [
  { name: "lavender", hex: "#8B7CF6" },
  { name: "peach", hex: "#E0873E" },
  { name: "mint", hex: "#2CA97A" },
  { name: "sky", hex: "#3E8FD1" },
  { name: "butter", hex: "#C79A1E" },
  { name: "blush", hex: "#C9578A" },
];

export default function EmojiColorPicker({
  emoji,
  color,
  onEmojiChange,
  onColorChange,
}: {
  emoji: string;
  color: string;
  onEmojiChange: (emoji: string) => void;
  onColorChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {EMOJIS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => onEmojiChange(e)}
            className={`p-1 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
              emoji === e ? "bg-accent-soft ring-2 ring-accent" : "hover:bg-surface-muted"
            }`}
          >
            <Avatar emoji={e} color={color} size={36} />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {COLORS.map((c) => (
          <button
            key={c.hex}
            type="button"
            onClick={() => onColorChange(c.hex)}
            aria-label={c.name}
            className="h-8 w-8 rounded-full cursor-pointer transition-transform flex items-center justify-center"
            style={{ background: c.hex, transform: color === c.hex ? "scale(1.15)" : "scale(1)" }}
          >
            {color === c.hex && <Check size={14} className="text-white" />}
          </button>
        ))}
      </div>
    </div>
  );
}
