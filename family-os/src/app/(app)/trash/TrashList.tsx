"use client";

import { useTransition } from "react";
import {
  RotateCcw,
  CalendarDays,
  FileText,
  Pill,
  Wallet,
  Plane,
  Phone,
  ListChecks,
  PartyPopper,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Card from "@/components/Card";
import DeleteButton from "@/components/DeleteButton";
import { restoreAppointment, permanentlyDeleteAppointment } from "../appointments/actions";
import { restoreDocument, permanentlyDeleteDocument } from "../documents/actions";
import { restoreMedicine, permanentlyDeleteMedicine } from "../medicines/actions";
import { restoreFinancialItem, permanentlyDeleteFinancialItem } from "../bills/actions";
import { restoreContact, permanentlyDeleteContact } from "../contacts/actions";
import { restoreImportantDate, permanentlyDeleteImportantDate } from "../dates/actions";
import { restoreTask, permanentlyDeleteTask } from "../tasks/actions";
import { restoreTrip, permanentlyDeleteTrip } from "../travel/actions";
import { restoreMember, permanentlyDeleteMember } from "../settings/actions";

export type TrashType =
  | "appointment"
  | "document"
  | "medicine"
  | "bill"
  | "contact"
  | "date"
  | "task"
  | "trip"
  | "member";

export interface TrashItem {
  id: number;
  type: TrashType;
  title: string;
  deletedAt: string;
}

const HANDLERS: Record<
  TrashType,
  { restore: (id: number) => Promise<void>; remove: (id: number) => Promise<void>; label: string; icon: LucideIcon }
> = {
  appointment: { restore: restoreAppointment, remove: permanentlyDeleteAppointment, label: "Appointment", icon: CalendarDays },
  document: { restore: restoreDocument, remove: permanentlyDeleteDocument, label: "Document", icon: FileText },
  medicine: { restore: restoreMedicine, remove: permanentlyDeleteMedicine, label: "Medicine", icon: Pill },
  bill: { restore: restoreFinancialItem, remove: permanentlyDeleteFinancialItem, label: "Bill", icon: Wallet },
  contact: { restore: restoreContact, remove: permanentlyDeleteContact, label: "Contact", icon: Phone },
  date: { restore: restoreImportantDate, remove: permanentlyDeleteImportantDate, label: "Important date", icon: PartyPopper },
  task: { restore: restoreTask, remove: permanentlyDeleteTask, label: "Task", icon: ListChecks },
  trip: { restore: restoreTrip, remove: permanentlyDeleteTrip, label: "Trip", icon: Plane },
  member: { restore: restoreMember, remove: permanentlyDeleteMember, label: "Family member", icon: UserRound },
};

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function TrashList({ items }: { items: TrashItem[] }) {
  if (items.length === 0) {
    return <Card className="p-6 text-center text-muted text-sm">Trash is empty.</Card>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <TrashRow key={`${item.type}-${item.id}`} item={item} />
      ))}
    </div>
  );
}

function TrashRow({ item }: { item: TrashItem }) {
  const [pending, startTransition] = useTransition();
  const h = HANDLERS[item.type];

  return (
    <Card className="p-4 flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-surface-muted flex items-center justify-center shrink-0 text-muted">
        <h.icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{item.title}</div>
        <div className="text-xs text-muted truncate">
          {h.label} · Deleted {timeAgo(item.deletedAt)}
        </div>
      </div>
      <button
        onClick={() => startTransition(() => h.restore(item.id))}
        disabled={pending}
        className="h-9 px-3 rounded-full flex items-center gap-1.5 text-sm font-bold text-accent hover:bg-accent-soft transition-colors cursor-pointer shrink-0 disabled:opacity-50"
      >
        <RotateCcw size={14} /> Restore
      </button>
      <DeleteButton onConfirm={() => h.remove(item.id)} label={`Delete ${item.title} forever`} />
    </Card>
  );
}
