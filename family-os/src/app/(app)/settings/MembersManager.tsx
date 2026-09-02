"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import MemberForm from "./MemberForm";
import { removeMember } from "./actions";

export interface Member {
  id: number;
  name: string;
  role: "parent" | "child" | "grandparent" | "other";
  emoji: string;
  color: string;
}

const ROLE_LABELS: Record<Member["role"], string> = {
  parent: "Parent / Guardian",
  child: "Child",
  grandparent: "Grandparent",
  other: "Other",
};

export default function MembersManager({ members }: { members: Member[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {members.map((m) =>
        editingId === m.id ? (
          <MemberForm key={m.id} existing={m} onDone={() => setEditingId(null)} />
        ) : (
          <Card key={m.id} className="p-4 flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-full flex items-center justify-center text-xl shrink-0"
              style={{ background: `${m.color}22` }}
            >
              {m.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{m.name}</div>
              <div className="text-xs text-muted truncate">{ROLE_LABELS[m.role]}</div>
            </div>
            <button
              onClick={() => setEditingId(m.id)}
              className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors cursor-pointer shrink-0"
              aria-label={`Edit ${m.name}`}
            >
              <Pencil size={16} />
            </button>
            <DeleteButton onConfirm={() => removeMember(m.id)} label={`Remove ${m.name}`} />
          </Card>
        )
      )}

      {adding ? (
        <MemberForm onDone={() => setAdding(false)} />
      ) : (
        <Button variant="secondary" onClick={() => setAdding(true)} className="w-full">
          <Plus size={18} /> Add family member
        </Button>
      )}
    </div>
  );
}
