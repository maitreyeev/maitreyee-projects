"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import Card from "@/components/Card";
import SoftDeleteButton from "@/components/SoftDeleteButton";
import { deleteFinancialItem, toggleItemPaid } from "./actions";

interface Item {
  id: number;
  type: string;
  title: string;
  provider: string | null;
  amount: number | null;
  due_date: string | null;
  recurring: string;
  is_paid: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  bill: "Bill",
  subscription: "Subscription",
  insurance: "Insurance",
  warranty: "Warranty",
  obligation: "Loan/EMI",
};

export default function FinancialRow({ item: i }: { item: Item }) {
  const [pending, startTransition] = useTransition();
  const overdue = !i.is_paid && i.due_date && new Date(i.due_date) < new Date(new Date().toDateString());

  return (
    <Card className={`p-4 flex items-center gap-3 ${i.is_paid ? "opacity-50" : ""}`}>
      <button
        onClick={() => startTransition(() => toggleItemPaid(i.id, !i.is_paid))}
        disabled={pending}
        className={`h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
          i.is_paid ? "bg-success border-success text-white" : "border-border"
        }`}
        aria-label={i.is_paid ? "Mark unpaid" : "Mark paid"}
      >
        {i.is_paid && <Check size={14} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`font-bold text-sm truncate ${i.is_paid ? "line-through" : ""}`}>{i.title}</div>
        <div className="text-xs text-muted truncate">
          {TYPE_LABELS[i.type] ?? i.type}
          {i.provider ? ` · ${i.provider}` : ""}
          {i.due_date && (
            <span className={overdue ? "text-danger font-bold" : ""}>
              {" "}
              · Due {new Date(i.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          )}
          {i.recurring !== "none" ? ` · ${i.recurring}` : ""}
        </div>
      </div>
      {i.amount !== null && <div className="font-extrabold text-sm shrink-0">₹{Number(i.amount).toLocaleString("en-IN")}</div>}
      <SoftDeleteButton onConfirm={() => deleteFinancialItem(i.id)} label="Delete item" />
    </Card>
  );
}
