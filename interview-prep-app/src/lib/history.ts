import type { RoleKey } from "@/data/types";
import type { FinalVerdict } from "./session";

export interface HistoryEntry {
  id: string;
  date: string; // ISO timestamp
  name: string;
  companyId: string;
  companyName: string;
  role: RoleKey;
  displayRole: string;
  attempt: number;
  verdict: FinalVerdict;
}

const KEY = "interview-prep-history";
const MAX_ENTRIES = 100;

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Returns false if the write failed (storage full or disabled), so the
 *  caller can tell the user their attempt wasn't recorded to history —
 *  losing that silently otherwise looks like the attempt vanished. */
export function appendHistoryEntry(entry: Omit<HistoryEntry, "id" | "date">): boolean {
  if (typeof window === "undefined") return true;
  const existing = loadHistory();
  const next: HistoryEntry[] = [
    { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, date: new Date().toISOString() },
    ...existing,
  ].slice(0, MAX_ENTRIES);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Ignore — nothing meaningful to recover from here.
  }
}

// Most recent past attempt for the same company + role, used to show a
// trend ("+8 vs last attempt") on the results page.
export function previousAttemptFor(companyId: string, role: RoleKey): HistoryEntry | null {
  const history = loadHistory();
  return history.find((h) => h.companyId === companyId && h.role === role) ?? null;
}
