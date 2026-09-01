import type { RoleKey } from "@/data/types";

export interface QuestionResult {
  roundId: string;
  roundName: string;
  question: string;
  answer: string;
  score: number; // 1-10
  verdict: string;
  strengths: string[];
  improvements: string[];
  modelAnswerTip: string;
}

export interface SessionState {
  name: string;
  companyId: string;
  role: RoleKey | null;
  attempt: number;
  results: QuestionResult[];
  currentRoundIndex: number;
  currentQuestionIndex: number;
  finalVerdict: FinalVerdict | null;
  // Probability score from the last completed attempt at this same
  // company+role, captured at completion time so the results page can show
  // a trend without re-deriving it from history (and getting an off-by-one
  // against the entry this very session just wrote).
  previousProbability?: number | null;
}

export interface FinalVerdict {
  probability: number; // 0-100
  band: "not-ready" | "developing" | "close" | "ready";
  headline: string;
  summary: string;
  roundBreakdown: { roundName: string; score: number; note: string }[];
  topStrengths: string[];
  priorityFixes: string[];
}

const KEY = "interview-prep-session";

export const emptySession: SessionState = {
  name: "",
  companyId: "",
  role: null,
  attempt: 1,
  results: [],
  currentRoundIndex: 0,
  currentQuestionIndex: 0,
  finalVerdict: null,
  previousProbability: null,
};

export function loadSession(): SessionState {
  if (typeof window === "undefined") return emptySession;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptySession;
    return { ...emptySession, ...JSON.parse(raw) };
  } catch {
    return emptySession;
  }
}

export function saveSession(state: SessionState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
