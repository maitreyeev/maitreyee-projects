"use client";

import { useState, useTransition } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label, Select } from "@/components/Input";
import EmojiColorPicker, { EMOJIS, COLORS } from "./EmojiColorPicker";
import { addMember, updateMember, type MemberInput } from "./actions";

interface ExistingMember extends MemberInput {
  id: number;
}

export default function MemberForm({
  existing,
  onDone,
}: {
  existing?: ExistingMember;
  onDone?: () => void;
}) {
  const [name, setName] = useState(existing?.name ?? "");
  const [role, setRole] = useState<MemberInput["role"]>(existing?.role ?? "parent");
  const [emoji, setEmoji] = useState(existing?.emoji ?? EMOJIS[0]);
  const color = existing?.color ?? COLORS[0].hex;
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    setError("");
    startTransition(async () => {
      try {
        const input: MemberInput = { name, role, emoji, color };
        if (existing) {
          await updateMember(existing.id, input);
        } else {
          await addMember(input);
          setName("");
          setRole("parent");
          setEmoji(EMOJIS[0]);
        }
        onDone?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div>
        <Label>Name</Label>
        <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      </div>
      <div>
        <Label>Role</Label>
        <Select value={role} onChange={(e) => setRole(e.target.value as MemberInput["role"])}>
          <option value="parent">Parent / Guardian</option>
          <option value="child">Child</option>
          <option value="grandparent">Grandparent</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <EmojiColorPicker emoji={emoji} onEmojiChange={setEmoji} />
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        {onDone && (
          <Button variant="ghost" onClick={onDone} className="flex-1">
            Cancel
          </Button>
        )}
        <Button onClick={submit} disabled={pending || !name.trim()} className="flex-1">
          {pending ? "Saving…" : existing ? "Save changes" : "Add to family"}
        </Button>
      </div>
    </Card>
  );
}
