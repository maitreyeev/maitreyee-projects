import { NextResponse } from "next/server";
import { gradeAnswer } from "@/lib/scoring";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roundName, roundFocus, roundEvaluates, question, answer } = body ?? {};

    if (!roundName || !question) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const result = gradeAnswer({
      roundName,
      roundFocus: roundFocus ?? "",
      roundEvaluates: roundEvaluates ?? "",
      question,
      answer: answer ?? "",
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Grading failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
