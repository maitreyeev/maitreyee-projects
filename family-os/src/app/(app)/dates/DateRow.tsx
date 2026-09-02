"use client";

import Card from "@/components/Card";
import DeleteButton from "@/components/DeleteButton";
import { deleteImportantDate } from "./actions";

interface DateItem {
  id: number;
  title: string;
  date: string;
  recurring_yearly: boolean;
  notes: string | null;
  next: Date;
}

export default function DateRow({ item: d }: { item: DateItem }) {
  const daysAway = Math.round((d.next.getTime() - new Date(new Date().toDateString()).getTime()) / 86400000);
  const label = daysAway === 0 ? "Today!" : daysAway === 1 ? "Tomorrow" : `In ${daysAway} days`;

  return (
    <Card className="p-4 flex items-center gap-3">
      <div className="h-11 w-11 rounded-2xl bg-peach flex flex-col items-center justify-center text-peach-ink shrink-0 leading-none">
        <span className="text-[10px] font-bold uppercase">{d.next.toLocaleDateString("en-IN", { month: "short" })}</span>
        <span className="text-base font-extrabold">{d.next.getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{d.title}</div>
        <div className="text-xs text-muted truncate">
          {label}
          {d.recurring_yearly ? " · Every year" : ""}
        </div>
      </div>
      <DeleteButton onConfirm={() => deleteImportantDate(d.id)} label="Delete date" />
    </Card>
  );
}
