import type { BoardId } from "@/data/types";

export interface JournalEntry {
  id: string;
  topicId: string;
  note: string;
  photo?: string; // small resized base64 data URL, optional
  createdAt: string; // ISO timestamp
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  boardId: BoardId;
  completedTopicIds: string[];
  journal: JournalEntry[];
}

export interface AppState {
  children: ChildProfile[];
  activeChildId: string | null;
}

const KEY = "homeroom-state";

export const emptyState: AppState = {
  children: [],
  activeChildId: null,
};

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadState(): AppState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw);
    return {
      children: Array.isArray(parsed.children) ? parsed.children : [],
      activeChildId: parsed.activeChildId ?? null,
    };
  } catch {
    return emptyState;
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or disabled (private browsing) — the app still works
    // for this visit, it just won't remember next time.
  }
}

export function getActiveChild(state: AppState): ChildProfile | null {
  return state.children.find((c) => c.id === state.activeChildId) ?? null;
}

export function addChild(
  state: AppState,
  data: { name: string; age: number; boardId: BoardId }
): AppState {
  const child: ChildProfile = {
    id: newId(),
    name: data.name,
    age: data.age,
    boardId: data.boardId,
    completedTopicIds: [],
    journal: [],
  };
  const next: AppState = {
    children: [...state.children, child],
    activeChildId: child.id,
  };
  saveState(next);
  return next;
}

export function setActiveChild(state: AppState, childId: string): AppState {
  const next: AppState = { ...state, activeChildId: childId };
  saveState(next);
  return next;
}

export function removeChild(state: AppState, childId: string): AppState {
  const children = state.children.filter((c) => c.id !== childId);
  const activeChildId =
    state.activeChildId === childId
      ? (children[0]?.id ?? null)
      : state.activeChildId;
  const next: AppState = { children, activeChildId };
  saveState(next);
  return next;
}

function updateChild(
  state: AppState,
  childId: string,
  patch: (child: ChildProfile) => ChildProfile
): AppState {
  const next: AppState = {
    ...state,
    children: state.children.map((c) => (c.id === childId ? patch(c) : c)),
  };
  saveState(next);
  return next;
}

export function toggleTopicDone(
  state: AppState,
  childId: string,
  topicId: string
): AppState {
  return updateChild(state, childId, (c) => {
    const done = c.completedTopicIds.includes(topicId);
    return {
      ...c,
      completedTopicIds: done
        ? c.completedTopicIds.filter((id) => id !== topicId)
        : [...c.completedTopicIds, topicId],
    };
  });
}

export function addJournalEntry(
  state: AppState,
  childId: string,
  entry: { topicId: string; note: string; photo?: string }
): AppState {
  const journalEntry: JournalEntry = {
    id: newId(),
    topicId: entry.topicId,
    note: entry.note,
    photo: entry.photo,
    createdAt: new Date().toISOString(),
  };
  return updateChild(state, childId, (c) => ({
    ...c,
    journal: [journalEntry, ...c.journal],
  }));
}

export function deleteJournalEntry(
  state: AppState,
  childId: string,
  entryId: string
): AppState {
  return updateChild(state, childId, (c) => ({
    ...c,
    journal: c.journal.filter((e) => e.id !== entryId),
  }));
}
