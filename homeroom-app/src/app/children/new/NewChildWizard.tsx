"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight, ArrowLeft, Sprout } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { BOARDS } from "@/data/boards";
import type { BoardId } from "@/data/types";
import { addChildAction } from "@/app/dashboard/actions";

type Step = "name" | "age" | "board" | "confirm";
const STEPS: Step[] = ["name", "age", "board", "confirm"];
const AGES = Array.from({ length: 14 }, (_, i) => i + 3);

export default function NewChildWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [boardId, setBoardId] = useState<BoardId | null>(null);
  const [error, setError] = useState("");
  const [loading, startTransition] = useTransition();

  const stepIndex = STEPS.indexOf(step);

  function next() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }
  function back() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
    else router.push("/dashboard");
  }

  function submit() {
    if (!age || !boardId) return;
    setError("");
    startTransition(async () => {
      try {
        await addChildAction({ name: name.trim(), age, boardId });
        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  const selectedBoard = BOARDS.find((b) => b.id === boardId);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 pt-16 sm:pt-24">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={back}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface-muted transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 h-1.5 rounded-full bg-surface-muted overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div key={step} className="animate-in">
          {step === "name" && (
            <>
              <Heading eyebrow="Add a child" title="What's their name?" />
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && name.trim() && next()}
                placeholder="Child's name"
                className="w-full h-14 rounded-2xl bg-surface-muted border border-border px-5 text-lg outline-none focus:border-accent transition-colors"
              />
              <Button size="lg" className="w-full mt-6" disabled={!name.trim()} onClick={next}>
                Continue <ArrowRight size={18} />
              </Button>
            </>
          )}

          {step === "age" && (
            <>
              <Heading eyebrow="Add a child" title={`How old is ${name.split(" ")[0] || "your child"}?`} />
              <div className="grid grid-cols-4 gap-2.5">
                {AGES.map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setAge(a);
                      next();
                    }}
                  >
                    <Card
                      className={`p-4 flex items-center justify-center text-lg font-extrabold hover:border-accent/50 transition-all cursor-pointer ${
                        age === a ? "border-accent bg-accent-soft" : ""
                      }`}
                    >
                      {a}
                    </Card>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "board" && (
            <>
              <Heading eyebrow="Add a child" title="Which board would you like to follow?" />
              <div className="flex flex-col gap-3">
                {BOARDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBoardId(b.id);
                      next();
                    }}
                    className="w-full text-left"
                  >
                    <Card
                      className={`p-5 flex items-center gap-4 transition-all hover:border-accent/50 cursor-pointer ${
                        boardId === b.id ? "border-accent" : ""
                      }`}
                    >
                      <div className="h-11 w-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0 font-extrabold text-sm">
                        {b.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold">{b.name}</div>
                        <div className="text-sm text-muted mt-0.5">{b.blurb}</div>
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "confirm" && selectedBoard && age && (
            <>
              <Heading eyebrow="You're all set" title="Add this child to your dashboard?" />
              <Card className="p-6 flex flex-col gap-4">
                <Row label="Child" value={name || "—"} />
                <Row label="Age" value={`${age} years old`} />
                <Row label="Board" value={selectedBoard.name} />
                <Row label="Grade / Stage" value={selectedBoard.gradeLabel(age)} />
              </Card>
              {error && <p className="text-sm text-danger mt-3">{error}</p>}
              <div className="mt-5 flex items-start gap-2.5 text-sm text-muted bg-surface-muted rounded-2xl p-4">
                <Sprout size={16} className="shrink-0 mt-0.5 text-accent" />
                <span>Same passcode, same household — this just adds a second syllabus to track.</span>
              </div>
              <Button size="lg" className="w-full mt-6" onClick={submit} disabled={loading}>
                {loading ? "Adding…" : <>Add {name.split(" ")[0] || "child"} <ArrowRight size={18} /></>}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-bold uppercase tracking-wider text-accent mb-2">{eyebrow}</div>
      <h2 className="text-2xl font-extrabold tracking-tight leading-tight">{title}</h2>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
