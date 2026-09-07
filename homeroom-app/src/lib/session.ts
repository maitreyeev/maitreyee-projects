import type { BoardId } from "@/data/types";

export interface SessionState {
  name: string;
  age: number | null;
  boardId: BoardId | null;
}

const KEY = "homeroom-session";

export const emptySession: SessionState = {
  name: "",
  age: null,
  boardId: null,
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
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or disabled (private browsing) — the app still works
    // for this visit, it just won't remember next time.
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
