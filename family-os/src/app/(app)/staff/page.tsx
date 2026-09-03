import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { HandHeart } from "lucide-react";
import Card from "@/components/Card";
import { getCurrentMember } from "@/lib/currentMember";
import StaffForm from "./StaffForm";
import StaffRow from "./StaffRow";

export default async function StaffPage() {
  const me = await getCurrentMember();
  if (!me) redirect("/login");

  const staff = await sql`
    SELECT id, name, role, phone, monthly_salary, salary_due_day, is_paid_this_month, notes
    FROM household_staff
    WHERE deleted_at IS NULL AND household_id = ${me.householdId}
    ORDER BY is_paid_this_month ASC, salary_due_day ASC NULLS LAST
  `;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-coral text-coral-ink flex items-center justify-center shrink-0">
          <HandHeart size={20} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Household Help</h1>
      </div>

      <StaffForm />

      {staff.length === 0 ? (
        <Card className="p-6 text-center text-muted text-sm">No household help added yet.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {(staff as {
            id: number;
            name: string;
            role: string;
            phone: string | null;
            monthly_salary: number | null;
            salary_due_day: number | null;
            is_paid_this_month: boolean;
            notes: string | null;
          }[]).map((s) => (
            <StaffRow key={s.id} staff={s} />
          ))}
        </div>
      )}
    </div>
  );
}
