# CrackIt — Interview Prep

Practice real Product Management and Project/Program Management interview
rounds for Google, Anthropic, Amazon, Microsoft, Qualcomm, Meta, Apple and
Netflix. Every round and question is drawn from real, commonly-reported
interview data (Glassdoor, Blind, Exponent, IGotAnOffer, etc.), tailored for
Indian candidates.

Every answer is scored **instantly and locally** by a deterministic
keyword/structure engine (`src/lib/scoring.ts`) — no API key, no external
calls, no per-use cost. It checks things like answer length, whether you
gave concrete numbers/metrics, STAR-style structure (situation → action →
result), and vocabulary relevant to what that round actually evaluates. It's
a structural check, not a semantic one — it can't judge whether your answer
is *correct*, only whether it's built the way a strong answer is usually
built. Trade-off: zero cost and instant feedback, but less nuanced than an
LLM grading your actual content.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). That's it — no env
file, no API key, nothing to configure. Runs fully offline once dependencies
are installed.

## How it works

- `src/data/` — the curated interview dataset (5 rounds per company/role,
  built from `data/research/*.json` via `scripts/build-data.js`).
- `src/app/page.tsx` — onboarding flow (name → role → company).
- `src/app/interview/page.tsx` — the interview loop: round intro → 3
  questions per round → instant scored feedback → next round.
- `src/app/results/page.tsx` — final report: selection-probability score,
  round-by-round breakdown, strengths, and priority fixes.
- `src/app/api/grade` and `src/app/api/final-verdict` — routes that call
  `src/lib/scoring.ts` directly (pure functions, no network I/O).
- Session state lives in `localStorage` (see `src/lib/session.ts`) — no
  backend/database, fully local to your browser.

### Regenerating the question bank

If you want to re-curate which rounds/questions are included, edit
`scripts/build-data.js` and re-run:

```bash
node scripts/build-data.js
```

This reads `data/research/group1.json` and `data/research/group2.json`
(the raw research) and writes the trimmed, uniform dataset to
`src/data/interview-data.json`.

### Tuning the scoring engine

All scoring logic lives in `src/lib/scoring.ts` — signal weights, the STAR/
filler/vocabulary word lists, and the per-round tip library are all plain
constants at the top of the file. Adjust and the dev server hot-reloads.
