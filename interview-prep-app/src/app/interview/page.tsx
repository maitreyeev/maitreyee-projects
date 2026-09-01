"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  MessageCircleQuestion,
  ThumbsUp,
  Wrench,
  Lightbulb,
  Sparkles,
  X,
  Mic,
  Square,
  TriangleAlert,
  BookOpen,
  ChevronDown,
  Timer as TimerIcon,
  ListChecks,
} from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import CompanyBadge from "@/components/CompanyBadge";
import { getCompany, loadRoleTrack, type RoleTrack } from "@/data";
import { pickQuestions } from "@/lib/pickQuestions";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { getModelAnswer } from "@/lib/modelAnswers";
import {
  loadSession,
  saveSession,
  type QuestionResult,
  type SessionState,
} from "@/lib/session";
import { appendHistoryEntry, previousAttemptFor } from "@/lib/history";

type Phase =
  | "loading"
  | "round-intro"
  | "answering"
  | "grading"
  | "feedback"
  | "round-summary"
  | "finishing"
  | "error";

const QUESTIONS_PER_ROUND = 3;
const TIMED_SECONDS = 120;

export default function InterviewPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [answer, setAnswer] = useState("");
  const [grade, setGrade] = useState<QuestionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIMED_SECONDS);
  const [roleTrack, setRoleTrack] = useState<RoleTrack | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const speech = useSpeechRecognition((finalChunk) => {
    setAnswer((prev) => (prev.trim() ? `${prev.trim()} ${finalChunk}` : finalChunk));
  });

  // Move focus to the answer box whenever a new question appears, so
  // keyboard and screen-reader users land somewhere useful instead of on
  // whatever the previous phase's now-removed button used to be. Polls
  // briefly rather than focusing directly in the effect body since the ref
  // may not be attached the instant `phase` flips (mount + animation start
  // happen across a render/paint boundary) — cheap insurance against a
  // one-frame race, not a workaround for a slow mount.
  useEffect(() => {
    if (phase !== "answering") return;
    let attempts = 0;
    const id = setInterval(() => {
      attempts += 1;
      if (textareaRef.current) {
        textareaRef.current.focus();
        clearInterval(id);
      } else if (attempts > 20) {
        clearInterval(id); // give up after ~2s rather than poll forever
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    // One-time hydration from localStorage (an external system) on mount.
    const s = loadSession();
    if (!s.name || !s.companyId || !s.role) {
      router.replace("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(s);
    setPhase(s.currentQuestionIndex === 0 ? "round-intro" : "answering");
  }, [router]);

  const company = session ? getCompany(session.companyId) : undefined;

  useEffect(() => {
    // The question bank for a company (~10-14KB) is only fetched once we
    // actually know which one was picked — the onboarding/results/history
    // pages never need it, so it isn't in their bundle either.
    if (!session?.companyId || !session.role) return;
    let cancelled = false;
    loadRoleTrack(session.companyId, session.role).then((track) => {
      if (!cancelled) setRoleTrack(track);
    });
    return () => {
      cancelled = true;
    };
  }, [session?.companyId, session?.role]);

  const rounds = roleTrack?.rounds ?? [];
  const round = session ? rounds[session.currentRoundIndex] : undefined;

  const questionsForRound = useMemo(() => {
    if (!round || !session) return [];
    return pickQuestions(round.questions, session.attempt, QUESTIONS_PER_ROUND);
  }, [round, session]);

  const question = session ? questionsForRound[session.currentQuestionIndex] : undefined;

  const totalQuestions = rounds.length * QUESTIONS_PER_ROUND;
  const completedQuestions = session
    ? session.currentRoundIndex * QUESTIONS_PER_ROUND + session.currentQuestionIndex
    : 0;
  const overallProgress = totalQuestions ? (completedQuestions / totalQuestions) * 100 : 0;

  async function submitAnswer() {
    if (!session || !company || !roleTrack || !round || !question) return;
    speech.stop();
    setPhase("grading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.name,
          displayRole: roleTrack.displayRole,
          roundName: round.name,
          roundFocus: round.focus,
          roundEvaluates: round.evaluates,
          question,
          answer,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Grading failed.");
      }
      const data = await res.json();
      const result: QuestionResult = {
        roundId: round.id,
        roundName: round.name,
        question,
        answer,
        score: data.score,
        verdict: data.verdict,
        strengths: data.strengths,
        improvements: data.improvements,
        modelAnswerTip: data.modelAnswerTip,
      };
      const next: SessionState = {
        ...session,
        results: [...session.results, result],
      };

      if (session.timedMode) {
        // No per-question feedback under time pressure — advance straight
        // through, and surface everything together once the round ends.
        const isLastQuestionInRound = session.currentQuestionIndex + 1 >= questionsForRound.length;
        const advanced: SessionState = isLastQuestionInRound
          ? next
          : { ...next, currentQuestionIndex: session.currentQuestionIndex + 1, questionDeadline: null };
        setSession(advanced);
        saveSession(advanced);
        setAnswer("");
        speech.dismissLooksOff();
        setPhase(isLastQuestionInRound ? "round-summary" : "answering");
        return;
      }

      setSession(next);
      saveSession(next);
      setGrade(result);
      setPhase("feedback");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("error");
    }
  }

  async function goNext() {
    if (!session || !company || !roleTrack) return;
    const isLastQuestionInRound = session.currentQuestionIndex + 1 >= questionsForRound.length;

    if (!isLastQuestionInRound) {
      const next: SessionState = {
        ...session,
        currentQuestionIndex: session.currentQuestionIndex + 1,
        questionDeadline: null,
      };
      setSession(next);
      saveSession(next);
      setAnswer("");
      setGrade(null);
      speech.dismissLooksOff();
      setPhase("answering");
      return;
    }

    const isLastRound = session.currentRoundIndex + 1 >= rounds.length;
    if (!isLastRound) {
      const next: SessionState = {
        ...session,
        currentRoundIndex: session.currentRoundIndex + 1,
        currentQuestionIndex: 0,
        questionDeadline: null,
      };
      setSession(next);
      saveSession(next);
      setAnswer("");
      setGrade(null);
      speech.dismissLooksOff();
      setPhase("round-intro");
      return;
    }

    // All rounds complete — compile final verdict.
    setPhase("finishing");
    try {
      const roundsPayload = rounds.map((r) => ({
        roundName: r.name,
        answers: session.results
          .filter((res) => res.roundId === r.id)
          .map((res) => ({
            question: res.question,
            answer: res.answer,
            score: res.score,
          })),
      }));

      const res = await fetch("/api/final-verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.name,
          displayRole: roleTrack.displayRole,
          candidateName: session.name,
          rounds: roundsPayload,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not compile your report.");
      }
      const verdict = await res.json();
      const previous = session.role ? previousAttemptFor(company.id, session.role) : null;
      if (session.role) {
        appendHistoryEntry({
          name: session.name,
          companyId: company.id,
          companyName: company.name,
          role: session.role,
          displayRole: roleTrack.displayRole,
          attempt: session.attempt,
          verdict,
        });
      }
      const finalSession: SessionState = {
        ...session,
        finalVerdict: verdict,
        previousProbability: previous?.verdict.probability ?? null,
      };
      saveSession(finalSession);
      router.push("/results");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("error");
    }
  }

  // Kept fresh every render so the interval below always submits the
  // latest typed/dictated answer, not whatever was in the box when the
  // countdown started (the classic stale-closure trap with setInterval).
  const submitAnswerRef = useRef(submitAnswer);
  useEffect(() => {
    submitAnswerRef.current = submitAnswer;
  });

  useEffect(() => {
    if (!session?.timedMode || phase !== "answering") return;

    // Deadline is persisted on the session (not just component state) so a
    // reload resumes the real countdown instead of granting a fresh 2
    // minutes — otherwise refreshing the page is a one-click way to cheat
    // a mode whose entire point is time pressure.
    let deadline = session.questionDeadline;
    if (!deadline) {
      deadline = Date.now() + TIMED_SECONDS * 1000;
      const withDeadline: SessionState = { ...session, questionDeadline: deadline };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSession(withDeadline);
      saveSession(withDeadline);
    }
    const activeDeadline = deadline;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((activeDeadline - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        submitAnswerRef.current();
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [phase, session]);

  if (phase === "loading" || !session || !company || !roleTrack || !round) {
    return <FullScreenLoader label="Setting up your interview…" />;
  }

  if (phase === "finishing") {
    return <FullScreenLoader label="Compiling your interview report…" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-8">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <header className="flex items-center gap-3">
          <CompanyBadge name={company.name} color={company.color} size={36} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {company.name} · {roleTrack.displayRole}
            </div>
            <div className="text-xs text-muted">
              Round {session.currentRoundIndex + 1} of {rounds.length} · {round.name}
            </div>
          </div>
        </header>
        <ProgressBar value={overallProgress} />

        {/* popLayout takes the exiting card out of flow via position:
            absolute so the entering one can render immediately without
            waiting on the exit animation's completion event — mode="wait"
            looked cleaner but can stall indefinitely if that completion
            event never fires (e.g. a backgrounded tab), which is a worse
            failure than a brief crossfade overlap. `relative` here scopes
            popLayout's absolute positioning to this container instead of
            escaping to the nearest positioned ancestor (or the viewport). */}
        <div className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
          {phase === "round-intro" && (
            <RoundIntro
              key="intro"
              round={round}
              timedMode={session.timedMode}
              onStart={() => setPhase("answering")}
            />
          )}

          {(phase === "answering" || phase === "grading") && question && (
            <FadeIn key={`q-${session.currentRoundIndex}-${session.currentQuestionIndex}`}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <MessageCircleQuestion size={14} />
                    Question {session.currentQuestionIndex + 1} of {questionsForRound.length}
                  </div>
                  {session.timedMode && phase === "answering" && (
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        timeLeft <= 15 ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent"
                      }`}
                    >
                      <TimerIcon size={12} />
                      {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                    </div>
                  )}
                </div>
                <p id="current-question" className="text-lg font-medium leading-snug mb-5">
                  {question}
                </p>
                <textarea
                  ref={textareaRef}
                  aria-labelledby="current-question"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    speech.dismissLooksOff();
                  }}
                  disabled={phase === "grading"}
                  placeholder="Type your answer as you would say it out loud. Be specific — use real examples, numbers, and structure."
                  rows={8}
                  className="w-full rounded-2xl bg-surface-muted border border-border p-4 text-[15px] leading-relaxed outline-none focus:border-accent transition-colors resize-none disabled:opacity-60"
                />
                {speech.listening && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    Listening…{speech.interimText && <span className="text-muted italic">&nbsp;{speech.interimText}</span>}
                  </div>
                )}
                {speech.error && (
                  <div className="mt-2 text-xs text-danger">{speech.error}</div>
                )}
                {speech.looksOff && !speech.listening && (
                  <div className="flex items-start gap-2 mt-2 text-xs text-warning bg-warning-soft rounded-xl px-3 py-2">
                    <TriangleAlert size={14} className="shrink-0 mt-0.5" />
                    <span>
                      That recording seems short for how long you were speaking — voice input may have missed
                      some of it. Worth a re-read before you submit.
                    </span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">{answer.trim().length} characters</span>
                    {speech.supported && (
                      <button
                        type="button"
                        onClick={() => (speech.listening ? speech.stop() : speech.start())}
                        disabled={phase === "grading"}
                        aria-label={speech.listening ? "Stop voice input" : "Answer by speaking"}
                        title={speech.listening ? "Stop voice input" : "Answer by speaking"}
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ${
                          speech.listening
                            ? "bg-danger text-white"
                            : "bg-surface-muted text-muted hover:text-foreground hover:bg-border/60 border border-border"
                        }`}
                      >
                        {speech.listening ? <Square size={13} /> : <Mic size={14} />}
                      </button>
                    )}
                  </div>
                  <Button
                    onClick={submitAnswer}
                    disabled={answer.trim().length < 15 || phase === "grading"}
                    className="w-full sm:w-auto whitespace-nowrap"
                  >
                    {phase === "grading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Grading…
                      </>
                    ) : (
                      <>
                        Submit answer <ArrowRight size={16} />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </FadeIn>
          )}

          {phase === "feedback" && grade && (
            <FeedbackCard key="feedback" grade={grade} round={round} onNext={goNext} />
          )}

          {phase === "round-summary" && (
            <RoundSummary
              key="round-summary"
              roundName={round.name}
              results={session.results.filter((r) => r.roundId === round.id)}
              onContinue={goNext}
            />
          )}

          {phase === "error" && (
            <FadeIn key="error">
              <Card className="p-6 flex flex-col items-center text-center gap-4">
                <div className="h-11 w-11 rounded-full bg-danger-soft text-danger flex items-center justify-center">
                  <X size={20} />
                </div>
                <p className="text-sm text-muted">{errorMsg}</p>
                <Button onClick={() => setPhase(session.currentQuestionIndex === 0 ? "round-intro" : "answering")}>
                  Try again
                </Button>
              </Card>
            </FadeIn>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function RoundIntro({
  round,
  timedMode,
  onStart,
}: {
  round: { name: string; format: string; focus: string };
  timedMode: boolean;
  onStart: () => void;
}) {
  return (
    <FadeIn>
      <Card className="p-7 flex flex-col gap-5">
        <div className="h-11 w-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{round.name}</h2>
          <p className="text-sm text-muted mt-2 leading-relaxed">{round.format}</p>
        </div>
        <div className="bg-surface-muted rounded-2xl p-4 text-sm leading-relaxed">
          <span className="font-medium">What this round is really testing: </span>
          {round.focus}
        </div>
        {timedMode && (
          <div className="flex items-center gap-2.5 text-sm text-accent bg-accent-soft rounded-2xl p-4">
            <TimerIcon size={16} className="shrink-0" />
            <span>Timed — 2 minutes per question, auto-submitted. Feedback shows after the round.</span>
          </div>
        )}
        <Button size="lg" onClick={onStart} className="w-full">
          Begin round <ArrowRight size={16} />
        </Button>
      </Card>
    </FadeIn>
  );
}

function RoundSummary({
  roundName,
  results,
  onContinue,
}: {
  roundName: string;
  results: QuestionResult[];
  onContinue: () => void;
}) {
  const avg = results.length ? results.reduce((s, r) => s + r.score, 0) / results.length : 0;
  return (
    <FadeIn key="round-summary">
      <Card className="p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3" role="status" aria-live="polite">
          <div className="h-11 w-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <ListChecks size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{roundName} — done</h2>
            <p className="text-xs text-muted mt-0.5">Averaged {avg.toFixed(1)}/10 across this round</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {results.map((r, i) => {
            const color =
              r.score >= 8 ? "var(--success)" : r.score >= 5 ? "var(--warning)" : "var(--danger)";
            return (
              <div key={i} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-medium leading-snug">{r.question}</p>
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{ background: `${color}1a`, color }}
                  >
                    {r.score}
                  </div>
                </div>
                {r.improvements[0] && (
                  <p className="text-xs text-muted leading-relaxed">· {r.improvements[0]}</p>
                )}
              </div>
            );
          })}
        </div>

        <Button size="lg" onClick={onContinue} className="w-full">
          Continue <ArrowRight size={16} />
        </Button>
      </Card>
    </FadeIn>
  );
}

function FeedbackCard({
  grade,
  round,
  onNext,
}: {
  grade: QuestionResult;
  round?: { focus: string; evaluates: string };
  onNext: () => void;
}) {
  const [showExample, setShowExample] = useState(false);
  const color =
    grade.score >= 8 ? "var(--success)" : grade.score >= 5 ? "var(--warning)" : "var(--danger)";
  const modelAnswer = round ? getModelAnswer(round.focus, round.evaluates) : null;

  return (
    <FadeIn key="feedback">
      <Card className="p-6 flex flex-col gap-5">
        <div className="flex items-center gap-4" role="status" aria-live="polite">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-semibold shrink-0"
            style={{ background: `${color}1a`, color }}
          >
            {grade.score}
          </div>
          <div>
            <div className="text-xs text-muted uppercase tracking-wide">Score / 10</div>
            <div className="font-medium leading-snug">{grade.verdict}</div>
          </div>
        </div>

        <FeedbackSection icon={<ThumbsUp size={15} />} title="What worked" items={grade.strengths} tone="success" />
        <FeedbackSection icon={<Wrench size={15} />} title="What to fix" items={grade.improvements} tone="danger" />

        <div className="bg-accent-soft text-accent rounded-2xl p-4 text-sm leading-relaxed flex gap-2.5">
          <Lightbulb size={16} className="shrink-0 mt-0.5" />
          <span>{grade.modelAnswerTip}</span>
        </div>

        {modelAnswer && (
          <div>
            <button
              type="button"
              onClick={() => setShowExample((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-accent cursor-pointer w-full"
            >
              <BookOpen size={15} />
              {showExample ? "Hide" : "See"} a strong example answer
              <ChevronDown size={15} className={`ml-auto transition-transform ${showExample ? "rotate-180" : ""}`} />
            </button>
            {showExample && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 bg-surface-muted rounded-2xl p-4 flex flex-col gap-3">
                  <div className="text-xs font-medium text-muted uppercase tracking-wide">{modelAnswer.title}</div>
                  <p className="text-sm leading-relaxed italic">&ldquo;{modelAnswer.example}&rdquo;</p>
                  <div className="border-t border-border pt-3 flex flex-col gap-1.5">
                    <div className="text-xs font-medium text-muted">Why this works</div>
                    {modelAnswer.whyItWorks.map((w, i) => (
                      <p key={i} className="text-xs text-muted leading-relaxed">
                        · {w}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs text-muted leading-relaxed pt-1">
                    This is a pattern to adapt with your own real example — not a script to recite.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}

        <Button size="lg" onClick={onNext} className="w-full">
          Next <ArrowRight size={16} />
        </Button>
      </Card>
    </FadeIn>
  );
}

function FeedbackSection({
  icon,
  title,
  items,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  tone: "success" | "danger";
}) {
  if (!items?.length) return null;
  const color = tone === "success" ? "var(--success)" : "var(--danger)";
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color }}>
        {icon} {title}
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-foreground/90 pl-1 leading-relaxed">
            · {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FadeIn({ children, ...rest }: { children: React.ReactNode; key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

function FullScreenLoader({ label }: { label: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <Loader2 size={28} className="animate-spin text-accent" />
      <p className="text-muted text-sm">{label}</p>
    </div>
  );
}
