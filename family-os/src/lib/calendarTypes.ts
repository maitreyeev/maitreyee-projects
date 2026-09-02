// Client-safe types and constants for calendar events — no server-only
// imports (like the DB client) so this can be imported from Client
// Components without pulling database code into the browser bundle.

export type EventType = "appointment" | "task" | "bill" | "date" | "medicine" | "trip";

export interface CalendarEvent {
  id: number;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string | null; // HH:MM, 24h — only set for appointments with a time
  title: string;
  sub: string | null;
  done: boolean;
  past: boolean;
  href: string;
}

export const EVENT_TONES: Record<EventType, "sky" | "mint" | "peach" | "lavender" | "blush" | "butter"> = {
  appointment: "sky",
  task: "mint",
  bill: "peach",
  date: "lavender",
  medicine: "blush",
  trip: "butter",
};

export const EVENT_LABELS: Record<EventType, string> = {
  appointment: "Appointment",
  task: "Task",
  bill: "Bill",
  date: "Important date",
  medicine: "Medicine refill",
  trip: "Trip",
};
