"use client";

import { motion } from "framer-motion";

export default function ProgressBar({
  value,
  className,
}: {
  value: number; // 0-100
  className?: string;
}) {
  return (
    <div
      className={`h-1.5 w-full rounded-full bg-surface-muted overflow-hidden ${className ?? ""}`}
    >
      <motion.div
        className="h-full rounded-full bg-accent"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
