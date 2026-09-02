"use client";

import Card from "@/components/Card";
import DeleteButton from "@/components/DeleteButton";
import { deleteExpense } from "../actions";

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string | null;
  notes: string | null;
}

export default function ExpenseRow({ expense: e, tripId }: { expense: Expense; tripId: number }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{e.category}</div>
        <div className="text-xs text-muted truncate">
          {e.date && new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          {e.notes ? ` · ${e.notes}` : ""}
        </div>
      </div>
      <div className="font-extrabold text-sm shrink-0">₹{Number(e.amount).toLocaleString("en-IN")}</div>
      <DeleteButton onConfirm={() => deleteExpense(e.id, tripId)} label="Delete expense" />
    </Card>
  );
}
