import clsx from "clsx";
import type { ReactNode } from "react";

export default function Card({
  children,
  className,
  tone = "surface",
}: {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "ink" | "lavender" | "peach" | "mint" | "sky" | "butter" | "blush";
}) {
  const tones: Record<string, string> = {
    surface: "bg-surface",
    ink: "bg-ink text-ink-foreground",
    lavender: "bg-lavender text-lavender-ink",
    peach: "bg-peach text-peach-ink",
    mint: "bg-mint text-mint-ink",
    sky: "bg-sky text-sky-ink",
    butter: "bg-butter text-butter-ink",
    blush: "bg-blush text-blush-ink",
  };

  return (
    <div className={clsx("rounded-3xl card-shadow", tones[tone], className)}>
      {children}
    </div>
  );
}
