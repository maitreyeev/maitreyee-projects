"use client";

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
  onEmojiChange,
}: {
  emoji: string;
  onEmojiChange: (emoji: string) => void;
}) {
  return (
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
          <Avatar emoji={e} size={36} />
        </button>
      ))}
    </div>
  );
}
