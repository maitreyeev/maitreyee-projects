# Homeroom — Homeschool, Made Fun

A one-click homeschool planner. A parent enters their child's name, age
(3–16) and board (CBSE, ICSE, IGCSE, or IB), gets a curated syllabus for
that exact age and board, and picks any subject/topic to get a
hands-on, activity-first lesson to teach it at home.

**Live:** deploy target is Vercel, free tier — no login, no API key, no
per-use cost. Session (name/age/board) is stored in `localStorage` only;
there's no backend or database.

## How the content is scoped

CBSE, ICSE, IGCSE (Cambridge Pathway) and IB genuinely converge on very
similar core topics at ages 3–16 — what differs is
grade naming, pacing and framing, not whether a 7-year-old learns
addition. So the syllabus (`src/data/topics.ts`) is one shared spine
across all four boards; `src/data/boards.ts` only changes the grade
label shown (e.g. age 7 → "Class 2" for CBSE/ICSE, "Cambridge Primary —
Stage 3" for IGCSE, "PYP — Ages 7–8" for IB) and the board's framing
blurb.

Lesson content (`src/data/lessons.ts`) is hand-curated and free — no AI
generation, no API key, no per-use cost. A flagship set of topics
(roughly one great, activity-filled lesson per subject per age) has
full lessons; everything else in the syllabus browser shows the real
topic but a "not written yet" state on its lesson page. The library is
meant to grow over time by adding more entries to `LESSONS`.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) (or whatever port
you pass). No env file, no API key, nothing to configure.

## Structure

- `src/data/types.ts` — shared types (`Board`, `Topic`, `Lesson`, etc.)
- `src/data/boards.ts` — the 4 boards + their age→grade-label mapping
- `src/data/topics.ts` — the full topic spine, ages 3–16
- `src/data/syllabus.ts` — groups topics into subjects per age, plus
  subject display labels/colours
- `src/data/lessons.ts` — the hand-written activity lessons, keyed by
  topic id
- `src/lib/session.ts` — `localStorage`-backed session (name/age/board)
- `src/app/page.tsx` — onboarding flow (name → age → board → confirm)
- `src/app/syllabus/page.tsx` — the curated syllabus browser
- `src/app/lesson/[topicId]/page.tsx` — the lesson (or "not written
  yet") view

### Adding a new lesson

Add an entry to `LESSONS` in `src/data/lessons.ts` keyed by an existing
`topicId` from `src/data/topics.ts` (or add a new topic first). Follow
the existing shape: a `hook` (one line to kick off the activity), a
`teach` array (2–3 short explanation points for the parent), one or two
`activities` (title, time, materials, steps), a `reflect` question, and
an `extension` idea.
