"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight, ArrowLeft, KeyRound, Sprout } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { BOARDS } from "@/data/boards";
import type { BoardId } from "@/data/types";
import { completeSignup } from "./actions";

type Step = "welcome" | "name" | "age" | "board" | "confirm" | "passcode";
const STEPS: Step[] = ["welcome", "name", "age", "board", "confirm", "passcode"];
const AGES = Array.from({ length: 14 }, (_, i) => i + 3); // 3..16

export default function SignupWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [boardId, setBoardId] = useState<BoardId | null>(null);
  const [passcode, setPasscode] = useState("");
  const [passcodeConfirm, setPasscodeConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, startTransition] = useTransition();

  const stepIndex = STEPS.indexOf(step);

  function next() {
    setError("");
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }
  function back() {
    setError("");
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  function submit() {
    setError("");
    if (passcode.length < 4) {
      setError("Passcode must be at least 4 characters.");
      return;
    }
    if (passcode !== passcodeConfirm) {
      setError("Passcodes don't match.");
      return;
    }
    if (!age || !boardId) return;
    startTransition(async () => {
      try {
        await completeSignup({ childName: name.trim(), age, boardId, passcode });
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
        {step !== "welcome" && (
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
                style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div key={step} className="animate-in">
          {step === "welcome" && (
            <div className="flex flex-col items-center text-center gap-6 py-10">
              <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center card-shadow-lg">
                <Sprout size={30} className="text-accent-ink" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Homeroom</h1>
                <p className="text-muted mt-3 leading-relaxed">
                  A one-click homeschool planner. Tell us your child&apos;s age and
                  board, get a curated syllabus, and pick any topic for a
                  hands-on, activity-filled lesson — free, no ads.
                </p>
              </div>
              <Button size="lg" className="w-full mt-2" onClick={next}>
                Get started <ArrowRight size={18} />
              </Button>
            </div>
          )}

          {step === "name" && (
            <>
              <Heading
                eyebrow="Step 1 of 5"
                title="What's your child's name?"
                subtitle="We'll use this to personalise the syllabus and lessons."
              />
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) next();
                }}
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
              <Heading
                eyebrow="Step 2 of 5"
                title={`How old is ${name.split(" ")[0] || "your child"}?`}
                subtitle="Homeroom currently covers ages 3–16 (Nursery through Class 10-equivalent)."
              />
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
              <Heading eyebrow="Step 3 of 5" title="Which board would you like to follow?" />
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
              <Heading eyebrow="Step 4 of 5" title="Here's the syllabus we'll build" />
              <Card className="p-6 flex flex-col gap-4">
                <Row label="Child" value={name || "—"} />
                <Row label="Age" value={`${age} years old`} />
                <Row label="Board" value={selectedBoard.name} />
                <Row label="Grade / Stage" value={selectedBoard.gradeLabel(age)} />
              </Card>
              <div className="mt-5 flex items-start gap-2.5 text-sm text-muted bg-surface-muted rounded-2xl p-4">
                <Sprout size={16} className="shrink-0 mt-0.5 text-accent" />
                <span>
                  Next, set a passcode — that&apos;s how you&apos;ll get back into{" "}
                  {name.split(" ")[0] || "your child"}&apos;s dashboard next time.
                </span>
              </div>
              <Button size="lg" className="w-full mt-6" onClick={next}>
                Continue <ArrowRight size={18} />
              </Button>
            </>
          )}

          {step === "passcode" && (
            <>
              <Heading
                eyebrow="Step 5 of 5"
                title="Set a household passcode"
                subtitle="No email, no password reset — just remember this. Anyone with it can see your dashboard."
              />
              <div className="flex flex-col gap-3">
                <input
                  autoFocus
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Passcode"
                  className="w-full h-14 rounded-2xl bg-surface-muted border border-border px-5 text-lg outline-none focus:border-accent transition-colors"
                />
                <input
                  type="password"
                  value={passcodeConfirm}
                  onChange={(e) => setPasscodeConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Confirm passcode"
                  className="w-full h-14 rounded-2xl bg-surface-muted border border-border px-5 text-lg outline-none focus:border-accent transition-colors"
                />
              </div>
              {error && <p className="text-sm text-danger mt-3">{error}</p>}
              <div className="mt-4 flex items-start gap-2.5 text-sm text-muted bg-surface-muted rounded-2xl p-4">
                <KeyRound size={16} className="shrink-0 mt-0.5 text-accent" />
                <span>Your passcode is stored securely — not even I can see it once set.</span>
              </div>
              <Button size="lg" className="w-full mt-6" onClick={submit} disabled={loading}>
                {loading ? "Setting up…" : <>Create my dashboard <ArrowRight size={18} /></>}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Heading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <div className="text-xs font-bold uppercase tracking-wider text-accent mb-2">{eyebrow}</div>
      <h2 className="text-2xl font-extrabold tracking-tight leading-tight">{title}</h2>
      {subtitle && <p className="text-muted mt-2">{subtitle}</p>}
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
