import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { Agent } from "undici";

let client: Anthropic | null = null;

// Some corporate networks (incl. this dev machine) run a TLS-inspecting
// proxy, so outbound HTTPS needs that proxy's CA trusted explicitly. If the
// cert isn't present (e.g. a normal network / production deploy), this is a
// no-op and the SDK uses Node's default trust store.
function buildDispatcher(): Agent | undefined {
  const certPath = path.join(process.cwd(), "certs", "dev-proxy-ca.pem");
  if (!fs.existsSync(certPath)) return undefined;
  return new Agent({ connect: { ca: fs.readFileSync(certPath) } });
}

export function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local (see .env.local.example)."
    );
  }
  if (!client) {
    const dispatcher = buildDispatcher();
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      fetchOptions: dispatcher ? { dispatcher } : undefined,
    });
  }
  return client;
}

export const MODEL = "claude-sonnet-5";

export interface GradeResult {
  score: number;
  verdict: string;
  strengths: string[];
  improvements: string[];
  modelAnswerTip: string;
  followUp: string | null;
}

const GRADE_TOOL: Anthropic.Tool = {
  name: "submit_grade",
  description: "Submit a structured grade for the candidate's interview answer.",
  input_schema: {
    type: "object",
    properties: {
      score: {
        type: "integer",
        minimum: 1,
        maximum: 10,
        description: "Score from 1 (very weak) to 10 (exceptional, hire-worthy answer).",
      },
      verdict: {
        type: "string",
        description: "A short 2-5 word verdict, e.g. 'Strong structure, weak metrics'.",
      },
      strengths: {
        type: "array",
        items: { type: "string" },
        description: "1-3 short, specific things the candidate did well.",
      },
      improvements: {
        type: "array",
        items: { type: "string" },
        description: "1-3 short, specific, actionable things to improve.",
      },
      modelAnswerTip: {
        type: "string",
        description:
          "1-3 sentences on how a top candidate would structure or strengthen this answer (frameworks, specifics, metrics).",
      },
      followUp: {
        type: ["string", "null"],
        description:
          "An optional sharp follow-up question a real interviewer would probe with, or null if not needed.",
      },
    },
    required: ["score", "verdict", "strengths", "improvements", "modelAnswerTip"],
  },
};

export async function gradeAnswer(params: {
  company: string;
  displayRole: string;
  roundName: string;
  roundFocus: string;
  roundEvaluates: string;
  question: string;
  answer: string;
}): Promise<GradeResult> {
  const anthropic = getClient();

  const system = `You are a senior, discerning interviewer at ${params.company}, conducting the "${params.roundName}" round for a ${params.displayRole} candidate. This round focuses on: ${params.roundFocus}. It evaluates: ${params.roundEvaluates}.

The candidate is an Indian job-seeker preparing for this real interview loop. Grade like a real ${params.company} interviewer would: be honest and specific, not encouraging for its own sake. Reward structured thinking (e.g. STAR for behavioral, clear frameworks for product/strategy, precise trade-off reasoning for technical/execution rounds), concrete metrics and specifics over vague generalities, and awareness of ${params.company}'s actual products/business context. Penalize rambling, no structure, and generic answers that could apply to any company. Calibrate scores like a real bar: 8-10 is a genuinely hire-worthy answer, 5-7 is passable but has clear gaps, 1-4 is weak. You must call the submit_grade tool with your structured evaluation.`;

  const userMessage = `Interview question: "${params.question}"\n\nCandidate's answer:\n"""\n${params.answer.trim() || "(no answer provided)"}\n"""\n\nGrade this answer now.`;

  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: userMessage }],
    tools: [GRADE_TOOL],
    tool_choice: { type: "tool", name: "submit_grade" },
  });

  const toolUse = msg.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
  );
  if (!toolUse) throw new Error("Model did not return a structured grade.");

  const input = toolUse.input as Partial<GradeResult>;
  return {
    score: clampScore(input.score),
    verdict: input.verdict ?? "",
    strengths: input.strengths ?? [],
    improvements: input.improvements ?? [],
    modelAnswerTip: input.modelAnswerTip ?? "",
    followUp: input.followUp ?? null,
  };
}

function clampScore(score: unknown): number {
  const n = typeof score === "number" ? score : Number(score);
  if (Number.isNaN(n)) return 5;
  return Math.min(10, Math.max(1, Math.round(n)));
}

export interface FinalVerdictResult {
  probability: number;
  band: "not-ready" | "developing" | "close" | "ready";
  headline: string;
  summary: string;
  roundBreakdown: { roundName: string; score: number; note: string }[];
  topStrengths: string[];
  priorityFixes: string[];
}

const VERDICT_TOOL: Anthropic.Tool = {
  name: "submit_verdict",
  description: "Submit the final selection-readiness verdict for the candidate.",
  input_schema: {
    type: "object",
    properties: {
      probability: {
        type: "integer",
        minimum: 0,
        maximum: 100,
        description: "Estimated probability (0-100) this candidate clears the full loop and gets an offer.",
      },
      band: {
        type: "string",
        enum: ["not-ready", "developing", "close", "ready"],
      },
      headline: {
        type: "string",
        description: "A punchy one-line verdict, e.g. 'Strong product sense, execution rounds will sink you'.",
      },
      summary: {
        type: "string",
        description: "2-4 sentence overall assessment, direct and specific, referencing actual patterns from the answers.",
      },
      roundBreakdown: {
        type: "array",
        items: {
          type: "object",
          properties: {
            roundName: { type: "string" },
            score: { type: "integer", minimum: 1, maximum: 10 },
            note: { type: "string", description: "One sharp sentence on this round's performance." },
          },
          required: ["roundName", "score", "note"],
        },
      },
      topStrengths: {
        type: "array",
        items: { type: "string" },
        description: "2-4 genuine strengths to keep leaning on.",
      },
      priorityFixes: {
        type: "array",
        items: { type: "string" },
        description: "2-4 highest-leverage things to fix before the real interview, most important first.",
      },
    },
    required: ["probability", "band", "headline", "summary", "roundBreakdown", "topStrengths", "priorityFixes"],
  },
};

export async function finalVerdict(params: {
  company: string;
  displayRole: string;
  candidateName: string;
  rounds: {
    roundName: string;
    answers: { question: string; answer: string; score: number }[];
  }[];
}): Promise<FinalVerdictResult> {
  const anthropic = getClient();

  const system = `You are the hiring committee lead at ${params.company}, delivering a final, honest readiness verdict to ${params.candidateName}, an Indian candidate who just completed a full mock interview loop for the ${params.displayRole} role. You've seen every round's questions, answers, and per-answer scores. Be direct like a real hiring debrief — do not sugarcoat, but stay constructive and specific. Weigh weaker rounds heavily (a single bad round often sinks a real loop), and calibrate the overall probability realistically against how competitive ${params.company} actually is. You must call the submit_verdict tool.`;

  const roundsText = params.rounds
    .map((r) => {
      const qas = r.answers
        .map(
          (a, i) =>
            `  Q${i + 1}: ${a.question}\n  Answer: ${a.answer.trim() || "(no answer)"}\n  Score given: ${a.score}/10`
        )
        .join("\n\n");
      return `Round: ${r.roundName}\n${qas}`;
    })
    .join("\n\n---\n\n");

  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1536,
    system,
    messages: [{ role: "user", content: roundsText }],
    tools: [VERDICT_TOOL],
    tool_choice: { type: "tool", name: "submit_verdict" },
  });

  const toolUse = msg.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
  );
  if (!toolUse) throw new Error("Model did not return a structured verdict.");

  return toolUse.input as FinalVerdictResult;
}
