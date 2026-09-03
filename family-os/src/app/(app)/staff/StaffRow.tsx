"use client";

import { useTransition } from "react";
import { Check, Phone } from "lucide-react";
import Card from "@/components/Card";
import SoftDeleteButton from "@/components/SoftDeleteButton";
import { deleteStaff, toggleStaffPaid } from "./actions";

interface Staff {
  id: number;
  name: string;
  role: string;
  phone: string | null;
  monthly_salary: number | null;
  salary_due_day: number | null;
  is_paid_this_month: boolean;
  notes: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  maid: "Maid / Housekeeper",
  cook: "Cook",
  driver: "Driver",
  nanny: "Nanny",
  gardener: "Gardener",
  cleaner: "Cleaner",
  other: "Other",
};

export default function StaffRow({ staff: s }: { staff: Staff }) {
  const [pending, startTransition] = useTransition();

  return (
    <Card className={`p-4 flex items-center gap-3 ${s.is_paid_this_month ? "opacity-60" : ""}`}>
      {s.monthly_salary !== null && (
        <button
          onClick={() => startTransition(() => toggleStaffPaid(s.id, !s.is_paid_this_month))}
          disabled={pending}
          className={`h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
            s.is_paid_this_month ? "bg-success border-success text-white" : "border-border"
          }`}
          aria-label={s.is_paid_this_month ? "Mark salary unpaid" : "Mark salary paid"}
        >
          {s.is_paid_this_month && <Check size={14} />}
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{s.name}</div>
        <div className="text-xs text-muted truncate flex items-center gap-1 flex-wrap">
          <span>{ROLE_LABELS[s.role] ?? s.role}</span>
          {s.phone && (
            <>
              <span>·</span>
              <Phone size={10} /> {s.phone}
            </>
          )}
          {s.salary_due_day && <span>· Due {s.salary_due_day}th of month</span>}
        </div>
        {s.notes && <div className="text-xs text-muted truncate mt-0.5">{s.notes}</div>}
      </div>
      {s.monthly_salary !== null && (
        <div className="font-extrabold text-sm shrink-0">₹{Number(s.monthly_salary).toLocaleString("en-IN")}</div>
      )}
      <SoftDeleteButton onConfirm={() => deleteStaff(s.id)} label={`Remove ${s.name}`} />
    </Card>
  );
}
