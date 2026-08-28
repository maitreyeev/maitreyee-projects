import { NextResponse } from "next/server";
import { computeFinalVerdict } from "@/lib/scoring";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, displayRole, candidateName, rounds } = body ?? {};

    if (!company || !displayRole || !Array.isArray(rounds) || rounds.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const result = computeFinalVerdict({
      company,
      displayRole,
      candidateName: candidateName || "Candidate",
      rounds,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Verdict generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
