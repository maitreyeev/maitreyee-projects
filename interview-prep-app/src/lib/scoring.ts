// Deterministic, keyword/structure-based answer scoring.
//
// No network calls, no API key, no per-use cost — every signal below is
// computed locally from the answer text. This trades semantic understanding
// (a real interviewer, or an LLM, would actually judge whether the content
// is *correct*) for a zero-cost, offline check of the structural/content
// signals that separate a strong interview answer from a weak one: length,
// specificity (numbers/metrics), STAR-style structure, domain vocabulary
// relevant to the round, and vague filler language.

export interface GradeResult {
  score: number; // 1-10
  verdict: string;
  strengths: string[];
  improvements: string[];
  modelAnswerTip: string;
}

export interface RoundScoreInput {
  roundName: string;
  answers: { question: string; answer: string; score: number }[];
}

export interface FinalVerdictResult {
  probability: number; // 0-100
  band: "not-ready" | "developing" | "close" | "ready";
  headline: string;
  summary: string;
  roundBreakdown: { roundName: string; score: number; note: string }[];
  topStrengths: string[];
  priorityFixes: string[];
}

const FILLER_PHRASES = [
  "i think",
  "i guess",
  "maybe",
  "probably",
  "kind of",
  "sort of",
  "i would say",
  "something like",
  "not sure",
  "i don't know",
];

const RESULT_WORDS = [
  "resulted in",
  "led to",
  "achieved",
  "increased",
  "decreased",
  "reduced",
  "grew",
  "improved",
  "impact",
  "outcome",
  "delivered",
  "launched",
  "shipped",
];

const ACTION_WORDS = [
  "i led",
  "i built",
  "i designed",
  "i decided",
  "i implemented",
  "we launched",
  "i drove",
  "i owned",
  "i created",
  "i proposed",
  "i coordinated",
  "i prioritized",
  "i defined",
];

const CONTEXT_WORDS = [
  "when i",
  "at my",
  "in my role",
  "the situation",
  "the challenge",
  "the problem",
  "my team",
  "at the time",
  "the context",
];

const PM_VOCAB = [
  "user",
  "customer",
  "metric",
  "data",
  "trade-off",
  "tradeoff",
  "prioritize",
  "prioritise",
  "roadmap",
  "stakeholder",
  "hypothesis",
  "experiment",
  "a/b test",
  "retention",
  "engagement",
  "revenue",
  "cost",
  "risk",
  "timeline",
  "dependency",
  "escalation",
  "requirement",
  "feature",
  "release",
  "launch",
  "kpi",
  "north star",
  "funnel",
  "conversion",
  "feedback",
  "iterate",
  "mvp",
  "scope",
  "cross-functional",
  "cross functional",
  "alignment",
  "milestone",
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9%₹$.\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function countOccurrences(haystack: string, needles: string[]): number {
  const lower = haystack.toLowerCase();
  return needles.reduce((n, phrase) => (lower.includes(phrase) ? n + 1 : n), 0);
}

function jaccardOverlap(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const w of setA) if (setB.has(w)) intersection++;
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}

interface Signals {
  wordCount: number;
  hasNumbers: boolean;
  hasPercent: boolean;
  hasCurrency: boolean;
  contextHits: number;
  actionHits: number;
  resultHits: number;
  vocabOverlapRatio: number;
  fillerCount: number;
  questionEcho: number;
}

function computeSignals(question: string, answer: string, roundFocus: string): Signals {
  const words = tokenize(answer);
  const wordCount = words.length;

  const uniqueRoundVocab = [...new Set(tokenize(roundFocus).filter((w) => w.length > 4))];
  const overlap = uniqueRoundVocab.length
    ? uniqueRoundVocab.filter((w) => words.includes(w)).length / uniqueRoundVocab.length
    : 0;

  return {
    wordCount,
    hasNumbers: /\d/.test(answer),
    hasPercent: /%/.test(answer),
    hasCurrency: /[₹$]|\brs\.?\b|\binr\b/i.test(answer),
    contextHits: countOccurrences(answer, CONTEXT_WORDS),
    actionHits: countOccurrences(answer, ACTION_WORDS),
    resultHits: countOccurrences(answer, RESULT_WORDS),
    vocabOverlapRatio: Math.max(overlap, countOccurrences(answer, PM_VOCAB) / 6),
    fillerCount: countOccurrences(answer, FILLER_PHRASES),
    questionEcho: jaccardOverlap(tokenize(question), words),
  };
}

export function gradeAnswer(params: {
  question: string;
  answer: string;
  roundName: string;
  roundFocus: string;
  roundEvaluates: string;
}): GradeResult {
  const { question, answer, roundFocus, roundEvaluates } = params;
  const s = computeSignals(question, answer, `${roundFocus} ${roundEvaluates}`);

  let score = 4.5;
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Length
  if (s.wordCount < 15) {
    score -= 2.5;
    improvements.push("This is very short for an interview answer — aim for at least a few full sentences with a concrete example.");
  } else if (s.wordCount < 40) {
    score -= 1;
    improvements.push("Expand this answer — a real interviewer would want more detail and a specific example.");
  } else if (s.wordCount <= 300) {
    score += 1;
    strengths.push("Good length — enough room to give a real example without rambling.");
  } else {
    score += 0.25;
    improvements.push("This answer runs long — practice tightening it so you can deliver it in ~90 seconds out loud.");
  }

  // Specificity
  if (s.hasNumbers || s.hasPercent || s.hasCurrency) {
    score += 1.5;
    strengths.push("You backed this up with concrete numbers — that's exactly what stands out to real interviewers.");
  } else {
    score -= 1;
    improvements.push("Add a concrete number or metric (%, ₹, time saved, users impacted) to make this answer memorable.");
  }

  // STAR structure
  const starHits = [s.contextHits > 0, s.actionHits > 0, s.resultHits > 0].filter(Boolean).length;
  if (starHits >= 2) {
    score += 1.5;
    strengths.push("Clear structure — you set up the context, what you did, and the outcome (STAR-style).");
  } else if (starHits === 1) {
    score += 0.25;
    improvements.push("Round this out with a clear before/after — what was the situation, and what changed because of you?");
  } else {
    score -= 1;
    improvements.push("Structure this with the STAR method: Situation, Task, Action, Result — it's what most interviewers are listening for.");
  }

  // Domain vocabulary relevance
  if (s.vocabOverlapRatio > 0.15) {
    score += 1;
    strengths.push("You used language that maps directly to what this round is actually evaluating.");
  } else {
    improvements.push(`Tie your answer more directly to what this round tests: ${roundEvaluates.split(".")[0].toLowerCase()}.`);
  }

  // Filler / vagueness
  if (s.fillerCount >= 3) {
    score -= 1.5;
    improvements.push('Cut hedging language ("I think", "maybe", "probably") — say it with more conviction.');
  }

  // Echoing the question with little new content
  if (s.questionEcho > 0.35 && s.wordCount < 60) {
    score -= 1.5;
    improvements.push("This mostly restates the question — add your own reasoning and a real example instead.");
  }

  score = Math.max(1, Math.min(10, Math.round(score * 2) / 2));

  const verdict =
    score >= 8
      ? "Strong, well-structured answer"
      : score >= 6
        ? "Solid, but has clear gaps"
        : score >= 4
          ? "Underdeveloped — needs real work"
          : "Too weak for a real interview";

  return {
    score,
    verdict,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    modelAnswerTip: pickTip(roundFocus, roundEvaluates),
  };
}

const TIP_LIBRARY: { match: RegExp; tip: string }[] = [
  {
    match: /leadership|behavio|googleyness|culture|drive|value/i,
    tip: "Structure behavioral answers as STAR: 30 seconds of context, 60 seconds of what you specifically did, then a quantified result. Say \"I\", not \"we\", when describing your own contribution.",
  },
  {
    match: /metric|analytic|execution|data/i,
    tip: "Lead with the metric you'd track, state a hypothesis, then walk through how you'd validate it. Numbers first, story second.",
  },
  {
    match: /strategy|business|competit/i,
    tip: "Use a simple framework out loud (market size → competitive position → recommendation) so the interviewer can follow your reasoning, not just your conclusion.",
  },
  {
    match: /product sense|design|user|roadmap/i,
    tip: "Anchor on a specific user and their problem before jumping to solutions — interviewers are grading how you think, not just what you'd build.",
  },
  {
    match: /technical|system|architecture|program management/i,
    tip: "Name the concrete trade-off explicitly (e.g. speed vs. reliability) and state which side you'd choose and why — don't just list considerations.",
  },
];

function pickTip(roundFocus: string, roundEvaluates: string): string {
  const text = `${roundFocus} ${roundEvaluates}`;
  const hit = TIP_LIBRARY.find((t) => t.match.test(text));
  return (
    hit?.tip ??
    "Whatever the question, anchor your answer in a specific real example with a measurable outcome — specificity is what separates a good answer from a generic one."
  );
}

export function computeFinalVerdict(params: {
  candidateName: string;
  company: string;
  displayRole: string;
  rounds: RoundScoreInput[];
}): FinalVerdictResult {
  const { rounds } = params;

  const roundBreakdown = rounds.map((r) => {
    const avg = r.answers.reduce((sum, a) => sum + a.score, 0) / (r.answers.length || 1);
    const rounded = Math.round(avg * 10) / 10;
    const note =
      rounded >= 8
        ? "Consistently strong across this round."
        : rounded >= 6
          ? "Passable, but at least one answer needs real work."
          : rounded >= 4
            ? "This round would likely be a weak point in the real loop."
            : "This round would very likely sink the loop as-is.";
    return { roundName: r.roundName, score: rounded, note };
  });

  const overallAvg =
    roundBreakdown.reduce((sum, r) => sum + r.score, 0) / (roundBreakdown.length || 1);
  const weakestRound = [...roundBreakdown].sort((a, b) => a.score - b.score)[0];

  // Weight the overall probability toward the weakest round — a single bad
  // round tends to sink a real loop more than the average implies.
  const weighted = overallAvg * 0.7 + (weakestRound?.score ?? overallAvg) * 0.3;
  const probability = Math.max(3, Math.min(96, Math.round((weighted - 1) * (100 / 9))));

  const band: FinalVerdictResult["band"] =
    probability >= 75 ? "ready" : probability >= 55 ? "close" : probability >= 35 ? "developing" : "not-ready";

  const allAnswers = rounds.flatMap((r) => r.answers);
  const allText = allAnswers.map((a) => a.answer).join(" ");

  const strengthSignals: string[] = [];
  const fixSignals: string[] = [];

  const hasNumbersRate =
    allAnswers.filter((a) => /\d/.test(a.answer)).length / (allAnswers.length || 1);
  if (hasNumbersRate > 0.6) strengthSignals.push("You consistently back up answers with concrete numbers and metrics.");
  else fixSignals.push("Add specific numbers/metrics to more of your answers — it's the fastest way to sound more credible.");

  const starRate =
    allAnswers.filter((a) => {
      const s = computeSignals("", a.answer, "");
      return [s.contextHits > 0, s.actionHits > 0, s.resultHits > 0].filter(Boolean).length >= 2;
    }).length / (allAnswers.length || 1);
  if (starRate > 0.5) strengthSignals.push("Your answers are consistently structured (context → action → result).");
  else fixSignals.push("Structure more answers with the STAR method — situation, action, result — instead of narrating in a straight line.");

  const shortRate = allAnswers.filter((a) => tokenize(a.answer).length < 40).length / (allAnswers.length || 1);
  if (shortRate > 0.4) fixSignals.push("Several answers were too short — practice expanding with one specific example each.");
  else strengthSignals.push("You give answers enough depth to actually demonstrate your thinking.");

  const fillerRate =
    allAnswers.filter((a) => countOccurrences(a.answer, FILLER_PHRASES) >= 2).length / (allAnswers.length || 1);
  if (fillerRate > 0.3) fixSignals.push('Cut hedging language ("I think", "maybe") — it undercuts otherwise strong answers.');

  if (weakestRound) fixSignals.push(`Prioritize practicing for "${weakestRound.roundName}" — it's your weakest round right now.`);
  if (/roadmap|prioriti[sz]e|trade-?off/i.test(allText)) strengthSignals.push("You naturally reach for prioritization/trade-off language.");

  const headline =
    band === "ready"
      ? `Strong across the board — you're close to interview-ready at ${params.company}.`
      : band === "close"
        ? `Solid foundation, but ${weakestRound?.roundName ?? "one round"} needs real work before the real thing.`
        : band === "developing"
          ? `You have the raw material, but structure and specificity are holding you back.`
          : `This loop would likely end early — the fundamentals need work before you interview.`;

  const summary = `Across ${rounds.length} rounds, your average scored ${overallAvg.toFixed(1)}/10, with "${weakestRound?.roundName ?? "one round"}" as the clear weak point at ${weakestRound?.score.toFixed(1) ?? "—"}/10. ${
    band === "ready" || band === "close"
      ? "Keep leaning on your strengths below, but don't skip the priority fixes — they're what separates a pass from a near-miss."
      : "Focus on the priority fixes below before scheduling a real interview — they're the difference between a quick rejection and a real shot."
  }`;

  return {
    probability,
    band,
    headline,
    summary,
    roundBreakdown,
    topStrengths: dedupe(strengthSignals).slice(0, 4),
    priorityFixes: dedupe(fixSignals).slice(0, 4),
  };
}

function dedupe(items: string[]): string[] {
  return [...new Set(items)];
}
