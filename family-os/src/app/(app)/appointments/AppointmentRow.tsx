"use client";

import { MapPin } from "lucide-react";
import Card from "@/components/Card";
import DeleteButton from "@/components/DeleteButton";
import { deleteAppointment } from "./actions";

interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  notes: string | null;
  member_name: string | null;
  emoji: string | null;
}

export default function AppointmentRow({ appointment: a }: { appointment: Appointment }) {
  const date = new Date(a.date);
  const isPast = date < new Date(new Date().toDateString());

  return (
    <Card className={`p-4 flex items-center gap-3 ${isPast ? "opacity-50" : ""}`}>
      <div className="h-11 w-11 rounded-2xl bg-lavender flex flex-col items-center justify-center text-lavender-ink shrink-0 leading-none">
        <span className="text-[10px] font-bold uppercase">{date.toLocaleDateString("en-IN", { month: "short" })}</span>
        <span className="text-base font-extrabold">{date.getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{a.title}</div>
        <div className="text-xs text-muted truncate">
          {a.time ? `${a.time} · ` : ""}
          {a.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={11} /> {a.location}
            </span>
          )}
          {a.member_name ? ` · ${a.emoji} ${a.member_name}` : ""}
        </div>
      </div>
      <DeleteButton onConfirm={() => deleteAppointment(a.id)} label="Delete appointment" />
    </Card>
  );
}
