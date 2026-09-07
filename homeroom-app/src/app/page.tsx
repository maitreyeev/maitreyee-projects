"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, Plus, Sprout, Trash2 } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { BOARDS, getBoard } from "@/data/boards";
import type { BoardId } from "@/data/types";
import {
  addChild,
  emptyState,
  loadState,
  removeChild,
  setActiveChild,
  type AppState,
} from "@/lib/store";

type Step = "welcome" | "name" | "age" | "board" | "confirm";
const STEPS: Step[] = ["welcome", "name", "age", "board", "confirm"];
const AGES = Array.from({ length: 14 }, (_, i) => i + 3); // 3..16

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const [adding, setAdding] = useState(false);

  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [boardId, setBoardId] = useState<BoardId | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from localStorage on mount
    setState(loadState());
    setHydrated(true);
  }, []);

  if (!hydrated) return <div className="min-h-screen" />;

  const showWizard = adding || state.children.length === 0;

  if (!showWizard) {
    return (
      <div className="min-h-screen flex flex-col items-center px-6 py-10 pt-16 sm:pt-24">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center gap-3 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center card-shadow-lg">
              <Sprout size={24} className="text-accent-ink" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Who&apos;s learning today?</h1>
          </div>

          <div className="flex flex-col gap-3">
            {state.children.map((child) => {
              const board = getBoard(child.boardId);
              return (
                <div key={child.id} className="flex items-center gap-2">
                  <button
                    className="flex-1 text-left"
                    onClick={() => {
                      setState(setActiveChild(state, child.id));
                      router.push("/syllabus");
                    }}
                  >
                    <Card className="p-5 flex items-center gap-4 hover:border-accent/50 transition-all cursor-pointer">
                      <div className="h-11 w-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0 font-extrabold">
                        {child.name.slice(0, 1).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold">{child.name || "Unnamed"}</div>
                        <div className="text-sm text-muted mt-0.5">
                          {board.name} · {board.gradeLabel(child.age)}
                        </div>
                      </div>
                    </Card>
                  </button>
                  <button
                    aria-label={`Remove ${child.name}`}
                    className="h-11 w-11 rounded-xl flex items-center justify-center text-muted hover:text-danger hover:bg-danger-soft transition-colors cursor-pointer shrink-0"
                    onClick={() => {
                      if (confirm(`Remove ${child.name || "this profile"}? This deletes their progress and journal too.`)) {
                        setState(removeChild(state, child.id));
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}

            <Button
              variant="secondary"
              size="lg"
              className="w-full mt-2"
              onClick={() => {
                setStep("welcome");
                setName("");
                setAge(null);
                setBoardId(null);
                setAdding(true);
              }}
            >
              <Plus size={18} /> Add another child
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(step);

  function next() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }
  function back() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
    else if (state.children.length > 0) setAdding(false);
  }

  function goToSyllabus() {
    if (!age || !boardId) return;
    const nextState = addChild(state, { name: name.trim() || "Your child", age, boardId });
    setState(nextState);
    router.push("/syllabus");
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
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {state.children.length > 0 ? "Add another child" : "Homeroom"}
                </h1>
                <p className="text-muted mt-3 leading-relaxed">
                  {state.children.length > 0
                    ? "Set up a syllabus for another child — each profile keeps its own progress and journal."
                    : "A one-click homeschool planner. Tell us your child's age and board, get a curated syllabus, and pick any topic for a hands-on, activity-filled lesson — free, no login."}
                </p>
              </div>
              <Button size="lg" className="w-full mt-2" onClick={next}>
                Get started <ArrowRight size={18} />
              </Button>
              {state.children.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>
                  Cancel
                </Button>
              )}
            </div>
          )}

          {step === "name" && (
            <>
              <Heading
                eyebrow="Step 1 of 4"
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
              <Button
                size="lg"
                className="w-full mt-6"
                disabled={!name.trim()}
                onClick={next}
              >
                Continue <ArrowRight size={18} />
              </Button>
            </>
          )}

          {step === "age" && (
            <>
              <Heading
                eyebrow="Step 2 of 4"
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
              <Heading
                eyebrow="Step 3 of 4"
                title="Which board would you like to follow?"
              />
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
              <Heading eyebrow="You're all set" title="Ready to build the syllabus?" />
              <Card className="p-6 flex flex-col gap-4">
                <Row label="Child" value={name || "—"} />
                <Row label="Age" value={`${age} years old`} />
                <Row label="Board" value={selectedBoard.name} />
                <Row label="Grade / Stage" value={selectedBoard.gradeLabel(age)} />
              </Card>
              <div className="mt-5 flex items-start gap-2.5 text-sm text-muted bg-surface-muted rounded-2xl p-4">
                <Sprout size={16} className="shrink-0 mt-0.5 text-accent" />
                <span>
                  We&apos;ll show a curated syllabus for {selectedBoard.gradeLabel(age)}{" "}
                  — pick any subject and topic, and get a fun, hands-on lesson
                  to teach it at home.
                </span>
              </div>
              <Button size="lg" className="w-full mt-6" onClick={goToSyllabus}>
                Build my syllabus <ArrowRight size={18} />
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
      <div className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
        {eyebrow}
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight leading-tight">
        {title}
      </h2>
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
