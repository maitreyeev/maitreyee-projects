"use client";

import { useState, useTransition } from "react";
import { Trash2, X } from "lucide-react";
import { verifyParentPin } from "@/lib/actions";
import Button from "./Button";
import { Input } from "./Input";

export default function DeleteButton({
  onConfirm,
  label = "Delete",
}: {
  onConfirm: () => Promise<void>;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function close() {
    setOpen(false);
    setPin("");
    setError("");
  }

  function submit() {
    setError("");
    startTransition(async () => {
      const ok = await verifyParentPin(pin);
      if (!ok) {
        setError("That PIN isn't right.");
        return;
      }
      await onConfirm();
      close();
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="h-9 w-9 rounded-full flex items-center justify-center text-danger hover:bg-danger-soft transition-colors cursor-pointer shrink-0"
        aria-label={label}
      >
        <Trash2 size={16} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center px-6" onClick={close}>
      <div
        className="bg-surface rounded-3xl p-6 w-full max-w-xs card-shadow-lg flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg">Parent PIN required</h3>
          <button onClick={close} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-surface-muted cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-muted">Enter the parent PIN to delete this.</p>
        <Input
          autoFocus
          type="text"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="PIN"
          className="text-center text-lg tracking-widest"
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button variant="danger" onClick={submit} disabled={pending || !pin}>
          {pending ? "Checking…" : "Confirm delete"}
        </Button>
      </div>
    </div>
  );
}
