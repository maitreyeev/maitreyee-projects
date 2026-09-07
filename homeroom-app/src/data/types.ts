export type SubjectKey =
  | "language"
  | "math"
  | "world"
  | "science"
  | "social"
  | "arts";

export type BoardId = "cbse" | "icse" | "igcse" | "ib";

export interface Board {
  id: BoardId;
  name: string;
  fullName: string;
  blurb: string;
  gradeLabel: (age: number) => string;
}

export interface Topic {
  id: string;
  age: number;
  subject: SubjectKey;
  title: string;
  blurb: string;
}

export interface Activity {
  title: string;
  time: string;
  materials: string[];
  steps: string[];
}

export interface Lesson {
  topicId: string;
  hook: string;
  teach: string[];
  activities: Activity[];
  reflect: string;
  extension: string;
}

export interface SubjectGroup {
  key: SubjectKey;
  label: string;
  topics: Topic[];
}
