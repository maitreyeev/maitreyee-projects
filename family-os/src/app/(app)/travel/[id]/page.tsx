import { notFound, redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { Plane, MapPin } from "lucide-react";
import Card from "@/components/Card";
import { getCurrentMember } from "@/lib/currentMember";
import ExpenseForm from "./ExpenseForm";
import ExpenseRow from "./ExpenseRow";
import DeleteTripButton from "./DeleteTripButton";

export default async function TripDetailPage({ params }: PageProps<"/travel/[id]">) {
  const me = await getCurrentMember();
  if (!me) redirect("/login");
  const { id } = await params;
  const tripId = Number(id);

  const [trips, expenses] = await Promise.all([
    sql`SELECT id, name, destination, start_date, end_date FROM travel_trips WHERE id = ${tripId} AND household_id = ${me.householdId} AND deleted_at IS NULL`,
    sql`SELECT id, category, amount, date, notes FROM travel_expenses WHERE trip_id = ${tripId} AND household_id = ${me.householdId} ORDER BY date ASC NULLS LAST, id ASC`,
  ]);

  const trip = trips[0] as { id: number; name: string; destination: string | null; start_date: string | null; end_date: string | null } | undefined;
  if (!trip) notFound();

  const total = (expenses as { amount: number }[]).reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-2xl bg-sky text-sky-ink flex items-center justify-center shrink-0">
          <Plane size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold tracking-tight">{trip.name}</h1>
          <div className="text-sm text-muted flex items-center gap-1">
            {trip.destination && (
              <>
                <MapPin size={12} /> {trip.destination}
              </>
            )}
          </div>
        </div>
        <DeleteTripButton tripId={trip.id} />
      </div>

      <Card tone="sky" className="p-5 flex items-center justify-between">
        <span className="font-bold">Total spent</span>
        <span className="text-2xl font-extrabold">₹{total.toLocaleString("en-IN")}</span>
      </Card>

      <ExpenseForm tripId={trip.id} />

      {expenses.length === 0 ? (
        <Card className="p-6 text-center text-muted text-sm">No expenses logged yet.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {(expenses as { id: number; category: string; amount: number; date: string | null; notes: string | null }[]).map((e) => (
            <ExpenseRow key={e.id} expense={e} tripId={trip.id} />
          ))}
        </div>
      )}
    </div>
  );
}
