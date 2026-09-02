"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/Card";
import { toggleTaskDone } from "./tasks/actions";
import { toggleItemPaid } from "./bills/actions";
import { EVENT_LABELS, type CalendarEvent, type EventType } from "@/lib/calendarTypes";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

const TONE_DOT: Record<EventType, string> = {
  appointment: "bg-sky-ink",
  task: "bg-mint-ink",
  bill: "bg-peach-ink",
  date: "bg-lavender-ink",
  medicine: "bg-blush-ink",
  trip: "bg-butter-ink",
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CalendarView({
  year,
  month,
  events,
  todayStr,
  prevHref,
  nextHref,
  monthLabel,
}: {
  year: number;
  month: number;
  events: CalendarEvent[];
  todayStr: string;
  prevHref: string;
  nextHref: string;
  monthLabel: string;
}) {
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const list = eventsByDate.get(e.date) ?? [];
    list.push(e);
    eventsByDate.set(e.date, list);
  }

  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const startWeekday = (firstOfMonth.getUTCDay() + 6) % 7; // Monday-indexed (0=Mon..6=Sun)
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

  const cells: { iso: string; day: number; inMonth: boolean }[] = [];
  for (let i = 0; i < totalCells; i++) {
    const d = new Date(Date.UTC(year, month - 1, i - startWeekday + 1));
    cells.push({
      iso: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
      day: d.getUTCDate(),
      inMonth: d.getUTCMonth() === month - 1,
    });
  }

  const defaultSelected = cells.some((c) => c.iso === todayStr && c.inMonth) ? todayStr : cells.find((c) => c.inMonth)!.iso;
  const [selected, setSelected] = useState(defaultSelected);

  const selectedEvents = [...(eventsByDate.get(selected) ?? [])].sort((a, b) => Number(a.done) - Number(b.done));
  const selectedLabel =
    selected === todayStr
      ? "Today"
      : new Date(`${selected}T00:00:00Z`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <Link
          href={prevHref}
          className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </Link>
        <h2 className="font-extrabold">{monthLabel}</h2>
        <Link
          href={nextHref}
          className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-muted mb-1">
        {WEEKDAYS.map((w, i) => (
          <div key={i}>{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((c) => {
          const dayEvents = eventsByDate.get(c.iso) ?? [];
          const types = [...new Set(dayEvents.map((e) => e.type))].slice(0, 4);
          const isToday = c.iso === todayStr;
          const isSelected = c.iso === selected;
          return (
            <button
              key={c.iso}
              onClick={() => setSelected(c.iso)}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-xs font-bold cursor-pointer transition-colors ${
                !c.inMonth ? "text-muted/40" : "text-foreground"
              } ${isSelected ? "bg-ink text-ink-foreground" : isToday ? "bg-accent-soft" : "hover:bg-surface-muted"}`}
            >
              <span>{c.day}</span>
              {types.length > 0 && (
                <span className="flex gap-0.5">
                  {types.map((t) => (
                    <span key={t} className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-ink-foreground" : TONE_DOT[t]}`} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 pt-4 border-t border-border">
        {(Object.keys(EVENT_LABELS) as EventType[]).map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className={`h-2 w-2 rounded-full ${TONE_DOT[t]}`} /> {EVENT_LABELS[t]}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex flex-col gap-1">
        <h3 className="text-sm font-extrabold mb-1">{selectedLabel}</h3>
        {selectedEvents.length === 0 ? (
          <p className="text-sm text-muted py-1">Nothing on this day.</p>
        ) : (
          selectedEvents.map((e) => <AgendaRow key={`${e.type}-${e.id}`} event={e} />)
        )}
      </div>
    </Card>
  );
}

function AgendaRow({ event: e }: { event: CalendarEvent }) {
  const [pending, startTransition] = useTransition();
  const toggleable = e.type === "task" || e.type === "bill";

  function toggle() {
    startTransition(async () => {
      if (e.type === "task") await toggleTaskDone(e.id, !e.done);
      if (e.type === "bill") await toggleItemPaid(e.id, !e.done);
    });
  }

  return (
    <Link href={e.href} className="flex items-center gap-3 py-1.5 group">
      {toggleable ? (
        <button
          onClick={(ev) => {
            ev.preventDefault();
            toggle();
          }}
          disabled={pending}
          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors disabled:opacity-50 ${
            e.done ? "bg-success border-success text-white" : "border-border"
          }`}
          aria-label={e.done ? "Mark not done" : "Mark done"}
        >
          {e.done && <Check size={12} />}
        </button>
      ) : (
        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ml-2 mr-1 ${TONE_DOT[e.type]}`} />
      )}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-bold truncate group-hover:underline ${e.done ? "line-through text-muted" : ""}`}>
          {e.title}
        </div>
        {e.sub && <div className="text-xs text-muted truncate">{e.sub}</div>}
      </div>
    </Link>
  );
}
