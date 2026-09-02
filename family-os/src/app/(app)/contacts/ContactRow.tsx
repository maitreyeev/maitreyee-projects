"use client";

import { Phone as PhoneIcon } from "lucide-react";
import Card from "@/components/Card";
import DeleteButton from "@/components/DeleteButton";
import { deleteContact } from "./actions";

interface Contact {
  id: number;
  name: string;
  relation: string | null;
  phone: string;
  notes: string | null;
}

export default function ContactRow({ contact: c }: { contact: Contact }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className="h-11 w-11 rounded-2xl bg-blush text-blush-ink flex items-center justify-center shrink-0">
        <PhoneIcon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{c.name}</div>
        <div className="text-xs text-muted truncate">
          {c.relation ? `${c.relation} · ` : ""}
          {c.phone}
        </div>
      </div>
      <a
        href={`tel:${c.phone}`}
        className="h-9 w-9 rounded-full flex items-center justify-center text-success hover:bg-success-soft transition-colors shrink-0"
        aria-label={`Call ${c.name}`}
      >
        <PhoneIcon size={16} />
      </a>
      <DeleteButton onConfirm={() => deleteContact(c.id)} label="Delete contact" />
    </Card>
  );
}
