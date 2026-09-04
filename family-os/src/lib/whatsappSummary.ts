import { getEventsInRange, todayIST } from "./calendarEvents";
import { EVENT_LABELS, type CalendarEvent, type EventType } from "./calendarTypes";

function addDaysISO(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const SECTION_EMOJI: Record<EventType, string> = {
  appointment: "📅",
  bill: "💰",
  task: "✅",
  medicine: "💊",
  date: "🎉",
  staff: "🧾",
  trip: "✈️",
};

const SECTION_ORDER: EventType[] = ["appointment", "bill", "task", "medicine", "date", "staff", "trip"];

export async function buildWeeklySummary(householdId: number, householdName: string): Promise<string> {
  const today = todayIST();
  const end = addDaysISO(today, 7);
  const events = await getEventsInRange(householdId, today, end);
  const relevant = events.filter((e: CalendarEvent) => !e.done);

  const lines: string[] = [];
  lines.push(`*${householdName} — This Week*`);
  lines.push(`${formatDateLabel(today)} to ${formatDateLabel(addDaysISO(today, 6))}`);
  lines.push("");

  let any = false;
  for (const type of SECTION_ORDER) {
    const items = relevant
      .filter((e: CalendarEvent) => e.type === type)
      .sort((a: CalendarEvent, b: CalendarEvent) => a.date.localeCompare(b.date));
    if (items.length === 0) continue;
    any = true;
    lines.push(`${SECTION_EMOJI[type]} *${EVENT_LABELS[type]}${items.length > 1 ? "s" : ""}*`);
    for (const item of items) {
      const dateLabel = formatDateLabel(item.date);
      const subPart = item.sub ? ` — ${item.sub}` : "";
      lines.push(`• ${item.title}${subPart} (${dateLabel})`);
    }
    lines.push("");
  }

  if (!any) {
    lines.push("Nothing due this week. 🎉");
    lines.push("");
  }

  lines.push("_Sent from Family OS_");
  return lines.join("\n");
}
