"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/Card";
import { toggleTaskDone } from "./tasks/actions";
import { toggleItemPaid } from "./bills/actions";
import { EVENT_LABELS, type CalendarEvent, type EventType } from "@/lib/calendarTypes";

const GRID_START_HOUR = 6;
const GRID_END_HOUR = 22;
const HOUR_HEIGHT = 52;
const GRID_HEIGHT = (GRID_END_HOUR - GRID_START_HOUR) * HOUR_HEIGHT;

const TONE_BG: Record<EventType, string> = {
  appointment: "bg-sky text-sky-ink",
  task: "bg-mint text-mint-ink",
  bill: "bg-peach text-peach-ink",
  date: "bg-lavender text-lavender-ink",
  medicine: "bg-blush text-blush-ink",
  trip: "bg-butter text-butter-ink",
  staff: "bg-coral text-coral-ink",
};

const TONE_DOT: Record<EventType, string> = {
  appointment: "bg-sky-ink",
  task: "bg-mint-ink",
  bill: "bg-peach-ink",
  date: "bg-lavender-ink",
  medicine: "bg-blush-ink",
  trip: "bg-butter-ink",
  staff: "bg-coral-ink",
};

function hourLabel(h: number) {
  const period = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12} ${period}`;
}

function timeToOffset(time: string): number {
  const [h, m] = time.split(":").map(Number);
  const clamped = Math.max(GRID_START_HOUR, Math.min(GRID_END_HOUR, h + m / 60));
  return (clamped - GRID_START_HOUR) * HOUR_HEIGHT;
}

export interface WeekDay {
  iso: string;
  weekday: string;
  dayNum: number;
  isToday: boolean;
}

export default function WeekCalendarView({
  days,
  events,
  prevHref,
  nextHref,
  todayHref,
  weekLabel,
}: {
  days: WeekDay[];
  events: CalendarEvent[];
  prevHref: string;
  nextHref: string;
  todayHref: string;
  weekLabel: string;
}) {
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const list = eventsByDate.get(e.date) ?? [];
    list.push(e);
    eventsByDate.set(e.date, list);
  }

  const hours = Array.from({ length: GRID_END_HOUR - GRID_START_HOUR }, (_, i) => GRID_START_HOUR + i);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <Link
          href={prevHref}
          className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors shrink-0"
          aria-label="Previous week"
        >
          <ChevronLeft size={16} />
        </Link>
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="font-extrabold truncate">{weekLabel}</h2>
          <Link href={todayHref} className="text-xs font-bold text-accent hover:underline shrink-0">
            Today
          </Link>
        </div>
        <Link
          href={nextHref}
          className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors shrink-0"
          aria-label="Next week"
        >
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto -mx-5 px-5">
        <div style={{ minWidth: 48 + days.length * 100 }}>
          {/* Day headers */}
          <div className="flex mb-2">
            <div className="w-12 shrink-0" />
            {days.map((d) => (
              <div key={d.iso} className="flex-1 text-center min-w-[100px]">
                <div className="text-[10px] font-bold uppercase text-muted">{d.weekday}</div>
                <div
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-extrabold mt-0.5 ${
                    d.isToday ? "bg-ink text-ink-foreground" : ""
                  }`}
                >
                  {d.dayNum}
                </div>
              </div>
            ))}
          </div>

          {/* All-day chips */}
          <div className="flex mb-2 border-b border-border pb-2">
            <div className="w-12 shrink-0 text-[10px] text-muted pt-1">all-day</div>
            {days.map((d) => {
              const dayEvents = (eventsByDate.get(d.iso) ?? []).filter((e) => !e.time);
              return (
                <div key={d.iso} className="flex-1 min-w-[100px] px-0.5 flex flex-col gap-1">
                  {dayEvents.map((e) => (
                    <Link
                      key={`${e.type}-${e.id}`}
                      href={e.href}
                      className={`text-[10px] font-bold px-1.5 py-1 rounded-lg truncate ${TONE_BG[e.type]} ${
                        e.done ? "opacity-50 line-through" : ""
                      }`}
                      title={e.title}
                    >
                      {e.title}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Time grid */}
          <div className="flex relative">
            <div className="w-12 shrink-0 relative" style={{ height: GRID_HEIGHT }}>
              {hours.map((h) => (
                <div
                  key={h}
                  className="absolute right-1 -translate-y-1/2 text-[10px] text-muted"
                  style={{ top: (h - GRID_START_HOUR) * HOUR_HEIGHT }}
                >
                  {hourLabel(h)}
                </div>
              ))}
            </div>
            {days.map((d) => {
              const timedEvents = (eventsByDate.get(d.iso) ?? []).filter((e) => e.time);
              return (
                <div
                  key={d.iso}
                  className="flex-1 min-w-[100px] relative border-l border-border"
                  style={{ height: GRID_HEIGHT }}
                >
                  {hours.map((h) => (
                    <div
                      key={h}
                      className="absolute left-0 right-0 border-t border-border"
                      style={{ top: (h - GRID_START_HOUR) * HOUR_HEIGHT }}
                    />
                  ))}
                  {timedEvents.map((e, i) => (
                    <TimedBlock key={`${e.type}-${e.id}`} event={e} index={i} count={timedEvents.length} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 pt-4 border-t border-border">
        {(Object.keys(EVENT_LABELS) as EventType[]).map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className={`h-2 w-2 rounded-full ${TONE_DOT[t]}`} /> {EVENT_LABELS[t]}
          </span>
        ))}
      </div>
    </Card>
  );
}

function TimedBlock({ event: e, index, count }: { event: CalendarEvent; index: number; count: number }) {
  const [pending, startTransition] = useTransition();
  const toggleable = e.type === "task" || e.type === "bill";
  const top = timeToOffset(e.time!);
  const width = 100 / count;
  const left = index * width;

  function toggle() {
    startTransition(async () => {
      if (e.type === "task") await toggleTaskDone(e.id, !e.done);
      if (e.type === "bill") await toggleItemPaid(e.id, !e.done);
    });
  }

  return (
    <Link
      href={e.href}
      className={`absolute rounded-lg px-1.5 py-1 text-[10px] font-bold overflow-hidden ${TONE_BG[e.type]} ${
        e.done ? "opacity-50" : ""
      }`}
      style={{ top, height: HOUR_HEIGHT - 4, left: `${left}%`, width: `${width}%` }}
      title={e.title}
    >
      <div className="flex items-center gap-1">
        {toggleable && (
          <button
            onClick={(ev) => {
              ev.preventDefault();
              toggle();
            }}
            disabled={pending}
            className={`h-3.5 w-3.5 rounded-full border shrink-0 flex items-center justify-center cursor-pointer disabled:opacity-50 ${
              e.done ? "bg-success border-success text-white" : "border-current"
            }`}
            aria-label={e.done ? "Mark not done" : "Mark done"}
          >
            {e.done && <Check size={9} />}
          </button>
        )}
        <span className={`truncate ${e.done ? "line-through" : ""}`}>{e.title}</span>
      </div>
    </Link>
  );
}
