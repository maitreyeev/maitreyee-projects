# CrackIt — Interview Prep

Practice real Product Management and Project/Program Management interview
rounds for Google, Anthropic, Amazon, Microsoft, Qualcomm, Meta, Apple and
Netflix. Every round and question is drawn from real, commonly-reported
interview data (Glassdoor, Blind, Exponent, IGotAnOffer, etc.), tailored for
Indian candidates. An AI interviewer (Claude) grades every answer live and
gives a final selection-probability verdict.

**Live:** https://interview-prep-app-seven-teal.vercel.app — installable as
a PWA (open on your phone → browser menu → "Add to Home Screen").

## Deployment

Hosted on Vercel, linked via `vercel link` (project: `crack-it4/interview-prep-app`).
To ship a change: `npx vercel --prod` from this directory. The production
deployment needs `ANTHROPIC_API_KEY` set in the Vercel dashboard under
**Project Settings → Environment Variables** — it isn't in git, so add it
there directly (not via CLI, so the key never passes through a shell/chat).

## Setup

1. **Install dependencies** (already done if you're picking this up fresh):

   ```bash
   npm install
   ```

2. **Add your Anthropic API key.** Copy the example env file and fill in your
   own key from [console.anthropic.com](https://console.anthropic.com/settings/keys):

   ```bash
   cp .env.local.example .env.local
   ```

   Then open `.env.local` and set `ANTHROPIC_API_KEY=sk-ant-...`. This file is
   gitignored and never leaves your machine — the key is only used server-side
   to call Claude when grading an answer.

3. **Run the dev server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## How it works

- `src/data/` — the curated interview dataset (5 rounds per company/role,
  built from `data/research/*.json` via `scripts/build-data.js`).
- `src/app/page.tsx` — onboarding flow (name → role → company).
- `src/app/interview/page.tsx` — the interview loop itself: round intro →
  3 questions per round → AI feedback per answer → next round.
- `src/app/results/page.tsx` — final report: selection-probability score,
  round-by-round breakdown, strengths, and priority fixes.
- `src/app/api/grade` and `src/app/api/final-verdict` — server routes that
  call the Claude API (`src/lib/anthropic.ts`) with structured tool-use
  prompts to produce consistent, scored feedback.
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

### Note on `certs/dev-proxy-ca.pem`

This dev machine sits behind a corporate TLS-inspecting proxy (Check Point
Harmony), so `src/lib/anthropic.ts` optionally trusts a local CA cert at
`certs/dev-proxy-ca.pem` for outbound calls to the Claude API. If that file
isn't present (e.g. on a different network or in production), this is a
no-op and the SDK just uses the default trust store — safe to delete if you
don't need it.
