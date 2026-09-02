"use client";

import { useState, useRef, useTransition } from "react";
import { Plus, Upload } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label, Select } from "@/components/Input";
import { addDocument } from "./actions";

const CATEGORIES = [
  { value: "medical", label: "Medical record" },
  { value: "school", label: "School report card" },
  { value: "insurance", label: "Insurance document" },
  { value: "warranty", label: "Warranty" },
  { value: "travel", label: "Travel document" },
  { value: "general", label: "General" },
];

export default function DocumentForm({ members }: { members: { id: number; name: string; emoji: string }[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fileName, setFileName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function submit(formData: FormData) {
    startTransition(async () => {
      await addDocument(formData);
      formRef.current?.reset();
      setFileName("");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full">
        <Plus size={18} /> Add document
      </Button>
    );
  }

  return (
    <Card className="p-5">
      <form ref={formRef} action={submit} className="flex flex-col gap-3">
        <div>
          <Label>Title</Label>
          <Input autoFocus name="title" placeholder="e.g. Health insurance policy" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Category</Label>
            <Select name="category" defaultValue="general">
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>For</Label>
            <Select name="familyMemberId">
              <option value="">Whole family</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.emoji} {m.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label>Expiry date (optional)</Label>
          <Input type="date" name="expiryDate" />
        </div>
        <div>
          <Label>File (optional)</Label>
          <label className="flex items-center gap-2 rounded-2xl bg-surface-muted border border-border px-4 py-3 text-sm cursor-pointer hover:bg-border/40 transition-colors">
            <Upload size={16} className="shrink-0 text-muted" />
            <span className="truncate text-muted">{fileName || "Choose a file to upload"}</span>
            <input
              type="file"
              name="file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={pending} className="flex-1">
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
