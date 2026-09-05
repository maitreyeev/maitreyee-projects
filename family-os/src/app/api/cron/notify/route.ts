import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getEventsInRange, todayIST } from "@/lib/calendarEvents";
import { sendPushToHousehold } from "@/lib/webPush";

const TYPE_ICON: Record<string, string> = {
  appointment: "\u{1F4C5}",
  task: "✅",
  bill: "\u{1F4B0}",
  date: "\u{1F389}",
  medicine: "\u{1F48A}",
  trip: "✈️",
  staff: "\u{1F4B5}",
};

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = todayIST();
  const tomorrow = new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const households = await sql`SELECT DISTINCT household_id FROM push_subscriptions`;
  let notified = 0;

  for (const row of households as { household_id: number }[]) {
    const householdId = row.household_id;
    const events = (await getEventsInRange(householdId, today, tomorrow)).filter((e) => !e.done);
    if (events.length === 0) continue;

    const lines = events.map((e) => `${TYPE_ICON[e.type] ?? "•"} ${e.title}`);
    const body = lines.length <= 4 ? lines.join("\n") : `${lines.slice(0, 3).join("\n")}\n+${lines.length - 3} more`;

    await sendPushToHousehold(householdId, {
      title: `${events.length} thing${events.length === 1 ? "" : "s"} today`,
      body,
      url: "/",
    });
    notified++;
  }

  return NextResponse.json({ ok: true, householdsNotified: notified });
}
