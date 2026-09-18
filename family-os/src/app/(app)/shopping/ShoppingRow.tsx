"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import Card from "@/components/Card";
import SoftDeleteButton from "@/components/SoftDeleteButton";
import { toggleShoppingItemChecked, deleteShoppingItem } from "./actions";

interface ShoppingItem {
  id: number;
  name: string;
  quantity: string | null;
  is_checked: boolean;
}

export default function ShoppingRow({ item }: { item: ShoppingItem }) {
  const [pending, startTransition] = useTransition();

  function toggle() {
    if (!pending) startTransition(() => toggleShoppingItemChecked(item.id, !item.is_checked));
  }

  return (
    <Card className={`p-4 flex items-center gap-3 cursor-pointer ${item.is_checked ? "opacity-50" : ""}`} onClick={toggle}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        disabled={pending}
        className={`h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
          item.is_checked ? "bg-success border-success text-white" : "border-border"
        }`}
        aria-label={item.is_checked ? "Mark not bought" : "Mark bought"}
      >
        {item.is_checked && <Check size={14} />}
      </button>
      <div className={`flex-1 min-w-0 font-bold text-sm truncate ${item.is_checked ? "line-through" : ""}`}>
        {item.name}
        {item.quantity && <span className="text-muted font-normal"> · {item.quantity}</span>}
      </div>
      <SoftDeleteButton onConfirm={() => deleteShoppingItem(item.id)} label={`Remove ${item.name}`} />
    </Card>
  );
}
