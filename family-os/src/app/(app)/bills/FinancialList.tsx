"use client";

import { useState } from "react";
import FinancialRow from "./FinancialRow";

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

const TABS = [
  { value: "all", label: "All" },
  { value: "bill", label: "Bills" },
  { value: "subscription", label: "Subscriptions" },
  { value: "insurance", label: "Insurance" },
  { value: "warranty", label: "Warranties" },
  { value: "obligation", label: "Loans/EMIs" },
];

export default function FinancialList({ items }: { items: Item[] }) {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? items : items.filter((i) => i.type === tab);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-colors ${
              tab === t.value ? "bg-ink text-ink-foreground" : "bg-surface-muted text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map((i) => (
            <FinancialRow key={i.id} item={i} />
          ))}
        </div>
      )}
    </div>
  );
}
