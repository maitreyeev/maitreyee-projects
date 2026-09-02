import Link from "next/link";
import { sql } from "@/lib/db";
import { Plane, MapPin } from "lucide-react";
import Card from "@/components/Card";
import TripForm from "./TripForm";

export default async function TravelPage() {
  const trips = await sql`
    SELECT t.id, t.name, t.destination, t.start_date, t.end_date,
      COALESCE(SUM(e.amount), 0)::float AS total_spent
    FROM travel_trips t
    LEFT JOIN travel_expenses e ON e.trip_id = t.id
    GROUP BY t.id
    ORDER BY t.start_date DESC NULLS LAST, t.id DESC
  `;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-sky text-sky-ink flex items-center justify-center shrink-0">
          <Plane size={20} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Travel</h1>
      </div>

      <TripForm />

      {trips.length === 0 ? (
        <Card className="p-6 text-center text-muted text-sm">No trips yet.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {(trips as {
            id: number;
            name: string;
            destination: string | null;
            start_date: string | null;
            end_date: string | null;
            total_spent: number;
          }[]).map((t) => (
            <Link key={t.id} href={`/travel/${t.id}`}>
              <Card className="p-4 flex items-center gap-3 hover:scale-[1.01] transition-transform">
                <div className="h-11 w-11 rounded-2xl bg-sky text-sky-ink flex items-center justify-center shrink-0">
                  <Plane size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{t.name}</div>
                  <div className="text-xs text-muted truncate flex items-center gap-1">
                    {t.destination && (
                      <>
                        <MapPin size={11} /> {t.destination}
                      </>
                    )}
                    {t.start_date &&
                      ` · ${new Date(t.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                  </div>
                </div>
                {t.total_spent > 0 && (
                  <div className="font-extrabold text-sm shrink-0">₹{t.total_spent.toLocaleString("en-IN")}</div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
