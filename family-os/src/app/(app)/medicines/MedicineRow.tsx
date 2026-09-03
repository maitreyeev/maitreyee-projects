"use client";

import { useTransition } from "react";
import Card from "@/components/Card";
import SoftDeleteButton from "@/components/SoftDeleteButton";
import { deleteMedicine, toggleMedicineActive } from "./actions";

interface Medicine {
  id: number;
  name: string;
  dosage: string | null;
  schedule: string | null;
  refill_date: string | null;
  notes: string | null;
  active: boolean;
  member_name: string | null;
  emoji: string | null;
}

export default function MedicineRow({ medicine: m }: { medicine: Medicine }) {
  const [pending, startTransition] = useTransition();
  // Display-only "due soon" check against wall-clock time — doesn't affect
  // memoization correctness, just whether this renders in red today.
  // eslint-disable-next-line react-hooks/purity
  const refillSoon = m.refill_date && new Date(m.refill_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <Card className={`p-4 flex items-center gap-3 ${!m.active ? "opacity-50" : ""}`}>
      <button
        onClick={() => startTransition(() => toggleMedicineActive(m.id, !m.active))}
        disabled={pending}
        className={`h-6 w-6 rounded-full border-2 shrink-0 cursor-pointer transition-colors ${
          m.active ? "bg-mint border-mint-ink" : "border-border"
        }`}
        aria-label={m.active ? "Mark inactive" : "Mark active"}
      />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">
          {m.name} {m.dosage && <span className="font-normal text-muted">· {m.dosage}</span>}
        </div>
        <div className="text-xs text-muted truncate">
          {m.schedule}
          {m.member_name ? ` · ${m.emoji} ${m.member_name}` : ""}
          {m.refill_date && (
            <span className={refillSoon ? "text-danger font-bold" : ""}>
              {" "}
              · Refill by {new Date(m.refill_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          )}
        </div>
      </div>
      <SoftDeleteButton onConfirm={() => deleteMedicine(m.id)} label="Delete medicine" />
    </Card>
  );
}
