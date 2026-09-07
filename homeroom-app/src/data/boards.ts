import type { Board, BoardId } from "./types";

const CBSE_ICSE_LABELS: Record<number, string> = {
  3: "Nursery",
  4: "LKG",
  5: "UKG",
  6: "Class 1",
  7: "Class 2",
  8: "Class 3",
  9: "Class 4",
  10: "Class 5",
  11: "Class 6",
  12: "Class 7",
  13: "Class 8",
};

const CAMBRIDGE_LABELS: Record<number, string> = {
  3: "Early Years 1",
  4: "Early Years 2",
  5: "Cambridge Primary — Stage 1",
  6: "Cambridge Primary — Stage 2",
  7: "Cambridge Primary — Stage 3",
  8: "Cambridge Primary — Stage 4",
  9: "Cambridge Primary — Stage 5",
  10: "Cambridge Primary — Stage 6",
  11: "Lower Secondary — Stage 7",
  12: "Lower Secondary — Stage 8",
  13: "Lower Secondary — Stage 9",
};

const IB_LABELS: Record<number, string> = {
  3: "PYP — Ages 3–4",
  4: "PYP — Ages 4–5",
  5: "PYP — Ages 5–6",
  6: "PYP — Ages 6–7",
  7: "PYP — Ages 7–8",
  8: "PYP — Ages 8–9",
  9: "PYP — Ages 9–10",
  10: "PYP — Ages 10–11",
  11: "PYP/MYP transition",
  12: "MYP 1",
  13: "MYP 2",
};

export const BOARDS: Board[] = [
  {
    id: "cbse",
    name: "CBSE",
    fullName: "Central Board of Secondary Education",
    blurb: "India's most widely followed board — structured, NCERT-based, exam-ready.",
    gradeLabel: (age) => CBSE_ICSE_LABELS[age] ?? "—",
  },
  {
    id: "icse",
    name: "ICSE",
    fullName: "Indian Certificate of Secondary Education",
    blurb: "Broader, English-and-humanities-rich syllabus with strong depth across subjects.",
    gradeLabel: (age) => CBSE_ICSE_LABELS[age] ?? "—",
  },
  {
    id: "igcse",
    name: "IGCSE",
    fullName: "Cambridge Pathway (leading to IGCSE)",
    blurb: "Cambridge's international pathway — skills and application over rote learning.",
    gradeLabel: (age) => CAMBRIDGE_LABELS[age] ?? "—",
  },
  {
    id: "ib",
    name: "IB",
    fullName: "International Baccalaureate (PYP / MYP)",
    blurb: "Inquiry-led and student-driven, with a strong focus on real-world thinking.",
    gradeLabel: (age) => IB_LABELS[age] ?? "—",
  },
];

export function getBoard(id: BoardId): Board {
  const board = BOARDS.find((b) => b.id === id);
  if (!board) throw new Error(`Unknown board: ${id}`);
  return board;
}
