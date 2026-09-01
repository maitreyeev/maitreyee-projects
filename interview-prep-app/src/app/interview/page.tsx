"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import CompanyBadge from "@/components/CompanyBadge";
import { getCompany, getRoleTrack } from "@/data";
import { pickQuestions } from "@/lib/pickQuestions";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import {
  loadSession,
  saveSession,
  type QuestionResult,
  type SessionState,
} from "@/lib/session";

type Phase = "loading" | "round-intro" | "answering" | "grading" | "feedback" | "finishing" | "error";

const QUESTIONS_PER_ROUND = 3;

export default function InterviewPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [answer, setAnswer] = useState("");
  const [grade, setGrade] = useState<QuestionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const speech = useSpeechRecognition((finalChunk) => {
    setAnswer((prev) => (prev.trim() ? `${prev.trim()} ${finalChunk}` : finalChunk));
  });

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
  const roleTrack =
    session && session.role ? getRoleTrack(session.companyId, session.role) : undefined;
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
      const finalSession: SessionState = { ...session, finalVerdict: verdict };
      saveSession(finalSession);
      router.push("/results");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("error");
    }
  }

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

        <AnimatePresence mode="wait" initial={false}>
          {phase === "round-intro" && (
            <RoundIntro key="intro" round={round} onStart={() => setPhase("answering")} />
          )}

          {(phase === "answering" || phase === "grading") && question && (
            <FadeIn key={`q-${session.currentRoundIndex}-${session.currentQuestionIndex}`}>
              <Card className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted mb-3">
                  <MessageCircleQuestion size={14} />
                  Question {session.currentQuestionIndex + 1} of {questionsForRound.length}
                </div>
                <p className="text-lg font-medium leading-snug mb-5">{question}</p>
                <textarea
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
            <FeedbackCard key="feedback" grade={grade} onNext={goNext} />
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
  );
}

function RoundIntro({
  round,
  onStart,
}: {
  round: { name: string; format: string; focus: string };
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
        <Button size="lg" onClick={onStart} className="w-full">
          Begin round <ArrowRight size={16} />
        </Button>
      </Card>
    </FadeIn>
  );
}

function FeedbackCard({
  grade,
  onNext,
}: {
  grade: QuestionResult;
  onNext: () => void;
}) {
  const color =
    grade.score >= 8 ? "var(--success)" : grade.score >= 5 ? "var(--warning)" : "var(--danger)";
  return (
    <FadeIn key="feedback">
      <Card className="p-6 flex flex-col gap-5">
        <div className="flex items-center gap-4">
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
