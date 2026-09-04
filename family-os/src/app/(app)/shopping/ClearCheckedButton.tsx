"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import Button from "@/components/Button";
import { clearCheckedShoppingItems } from "./actions";

export default function ClearCheckedButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      onClick={() => startTransition(() => clearCheckedShoppingItems())}
      disabled={pending}
      className="w-fit self-end text-sm"
    >
      <Trash2 size={14} /> Clear bought items
    </Button>
  );
}
