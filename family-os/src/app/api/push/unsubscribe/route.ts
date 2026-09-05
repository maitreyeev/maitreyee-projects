import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";

export async function POST(req: Request) {
  const me = await getCurrentMember();
  if (!me) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { endpoint } = (await req.json()) as { endpoint: string };
  if (!endpoint) return NextResponse.json({ error: "Missing endpoint." }, { status: 400 });

  await sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint} AND household_id = ${me.householdId}`;

  return NextResponse.json({ ok: true });
}
