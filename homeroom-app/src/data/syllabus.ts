import type { SubjectKey, SubjectGroup } from "./types";
import { topicsForAge } from "./topics";
import { getLesson } from "./lessons";

const SUBJECT_ORDER: SubjectKey[] = ["language", "math", "world", "science", "social", "arts"];

export function subjectLabel(subject: SubjectKey, age: number): string {
  switch (subject) {
    case "language":
      return age <= 5 ? "Language & Literacy" : "English";
    case "math":
      return age <= 5 ? "Numbers & Early Math" : "Mathematics";
    case "world":
      return "My World (EVS)";
    case "science":
      return "Science";
    case "social":
      return age <= 10 ? "Social Studies" : "Social Science";
    case "arts":
      return "Creative Arts & Craft";
  }
}

export const SUBJECT_STYLE: Record<SubjectKey, { bg: string; text: string; dot: string }> = {
  language: { bg: "bg-sky-soft", text: "text-sky", dot: "bg-sky" },
  math: { bg: "bg-sun-soft", text: "text-sun", dot: "bg-sun" },
  world: { bg: "bg-accent-soft", text: "text-accent", dot: "bg-accent" },
  science: { bg: "bg-accent-soft", text: "text-accent", dot: "bg-accent" },
  social: { bg: "bg-berry-soft", text: "text-berry", dot: "bg-berry" },
  arts: { bg: "bg-plum-soft", text: "text-plum", dot: "bg-plum" },
};

export function syllabusForAge(age: number): SubjectGroup[] {
  const topics = topicsForAge(age);
  const groups: SubjectGroup[] = [];
  for (const key of SUBJECT_ORDER) {
    const subjectTopics = topics.filter((t) => t.subject === key);
    if (subjectTopics.length === 0) continue;
    groups.push({ key, label: subjectLabel(key, age), topics: subjectTopics });
  }
  return groups;
}

export interface SubjectProgress {
  key: SubjectKey;
  label: string;
  done: number;
  total: number;
}

export interface ChildProgress {
  subjects: SubjectProgress[];
  done: number;
  total: number;
  activitiesReady: number;
}

export function computeProgress(age: number, completedTopicIds: string[]): ChildProgress {
  const groups = syllabusForAge(age);
  const completed = new Set(completedTopicIds);
  const subjects: SubjectProgress[] = groups.map((g) => ({
    key: g.key,
    label: g.label,
    done: g.topics.filter((t) => completed.has(t.id)).length,
    total: g.topics.length,
  }));
  const done = subjects.reduce((n, s) => n + s.done, 0);
  const total = subjects.reduce((n, s) => n + s.total, 0);
  const activitiesReady = groups.flatMap((g) => g.topics).filter((t) => getLesson(t.id)).length;
  return { subjects, done, total, activitiesReady };
}
