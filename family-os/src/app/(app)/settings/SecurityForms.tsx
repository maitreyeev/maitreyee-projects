"use client";

import { useState, useTransition } from "react";
import { KeyRound, Lock } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label } from "@/components/Input";
import { changePasscode, changePin } from "./actions";

export default function SecurityForms() {
  return (
    <div className="grid gap-3">
      <ChangeForm
        icon={Lock}
        title="Change household passcode"
        subtitle="Everyone will need the new passcode to open the app."
        newLabel="New passcode"
        newPlaceholder="At least 4 characters"
        onSubmit={(pin, next) => changePasscode(pin, next)}
      />
      <ChangeForm
        icon={KeyRound}
        title="Change parent PIN"
        subtitle="Required to delete anything and to make security changes like this one."
        newLabel="New PIN (4-8 digits)"
        newPlaceholder="e.g. 4821"
        numeric
        onSubmit={(pin, next) => changePin(pin, next)}
      />
    </div>
  );
}

function ChangeForm({
  icon: Icon,
  title,
  subtitle,
  newLabel,
  newPlaceholder,
  numeric,
  onSubmit,
}: {
  icon: typeof Lock;
  title: string;
  subtitle: string;
  newLabel: string;
  newPlaceholder: string;
  numeric?: boolean;
  onSubmit: (currentPin: string, next: string) => Promise<void>;
}) {
  const [currentPin, setCurrentPin] = useState("");
  const [next, setNext] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError("");
    setSuccess(false);
    startTransition(async () => {
      try {
        await onSubmit(currentPin, next);
        setCurrentPin("");
        setNext("");
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <Icon size={18} className="text-accent shrink-0" />
        <h3 className="font-extrabold">{title}</h3>
      </div>
      <p className="text-xs text-muted -mt-1">{subtitle}</p>
      <div>
        <Label>Current parent PIN</Label>
        <Input
          type="text"
          inputMode="numeric"
          value={currentPin}
          onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
          placeholder="PIN"
        />
      </div>
      <div>
        <Label>{newLabel}</Label>
        <Input
          type="text"
          inputMode={numeric ? "numeric" : "text"}
          value={next}
          onChange={(e) => setNext(numeric ? e.target.value.replace(/\D/g, "") : e.target.value)}
          placeholder={newPlaceholder}
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {success && <p className="text-sm text-success">Updated.</p>}
      <Button onClick={submit} disabled={pending || !currentPin || !next} variant="secondary">
        {pending ? "Saving…" : "Save"}
      </Button>
    </Card>
  );
}
