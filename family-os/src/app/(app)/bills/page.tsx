import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { Wallet } from "lucide-react";
import Card from "@/components/Card";
import { getCurrentMember } from "@/lib/currentMember";
import FinancialForm from "./FinancialForm";
import FinancialList from "./FinancialList";

export default async function BillsPage() {
  const me = await getCurrentMember();
  if (!me) redirect("/login");
  const items = await sql`
    SELECT id, type, title, provider, amount, due_date, recurring, is_paid
    FROM financial_items
    WHERE deleted_at IS NULL AND household_id = ${me.householdId}
    ORDER BY is_paid ASC, due_date ASC NULLS LAST
  `;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-butter text-butter-ink flex items-center justify-center shrink-0">
          <Wallet size={20} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Bills & Payments</h1>
      </div>

      <FinancialForm />

      <FinancialList
        items={
          items as {
            id: number;
            type: string;
            title: string;
            provider: string | null;
            amount: number | null;
            due_date: string | null;
            recurring: string;
            is_paid: boolean;
          }[]
        }
      />

      {items.length === 0 && <Card className="p-6 text-center text-muted text-sm">Nothing tracked yet.</Card>}
    </div>
  );
}
