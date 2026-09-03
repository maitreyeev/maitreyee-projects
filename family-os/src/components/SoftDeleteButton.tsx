"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export default function SoftDeleteButton({
  onConfirm,
  label = "Delete",
}: {
  onConfirm: () => Promise<void>;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(onConfirm)}
      disabled={pending}
      className="h-9 w-9 rounded-full flex items-center justify-center text-danger hover:bg-danger-soft transition-colors cursor-pointer shrink-0 disabled:opacity-50"
      aria-label={label}
    >
      <Trash2 size={16} />
    </button>
  );
}
