import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import Card from "@/components/Card";
import { getCurrentMember } from "@/lib/currentMember";
import ShoppingForm from "./ShoppingForm";
import ShoppingRow from "./ShoppingRow";
import ClearCheckedButton from "./ClearCheckedButton";

export default async function ShoppingPage() {
  const me = await getCurrentMember();
  if (!me) redirect("/login");

  const items = await sql`
    SELECT id, name, quantity, is_checked
    FROM shopping_items
    WHERE deleted_at IS NULL AND household_id = ${me.householdId}
    ORDER BY is_checked ASC, created_at ASC
  `;
  const typedItems = items as { id: number; name: string; quantity: string | null; is_checked: boolean }[];
  const hasChecked = typedItems.some((i) => i.is_checked);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-mint text-mint-ink flex items-center justify-center shrink-0">
          <ShoppingCart size={20} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Shopping List</h1>
      </div>

      <ShoppingForm />

      {typedItems.length === 0 ? (
        <Card className="p-6 text-center text-muted text-sm">Nothing on the list yet.</Card>
      ) : (
        <>
          {hasChecked && <ClearCheckedButton />}
          <div className="flex flex-col gap-3">
            {typedItems.map((item) => (
              <ShoppingRow key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
