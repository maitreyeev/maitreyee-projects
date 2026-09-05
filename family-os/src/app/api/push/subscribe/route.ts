import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";

export async function POST(req: Request) {
  const me = await getCurrentMember();
  if (!me) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const body = await req.json();
  const { endpoint, keys } = body as { endpoint: string; keys: { p256dh: string; auth: string } };
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Invalid subscription." }, { status: 400 });
  }

  await sql`
    INSERT INTO push_subscriptions (household_id, member_id, endpoint, p256dh, auth)
    VALUES (${me.householdId}, ${me.id}, ${endpoint}, ${keys.p256dh}, ${keys.auth})
    ON CONFLICT (endpoint) DO UPDATE SET household_id = ${me.householdId}, member_id = ${me.id}, p256dh = ${keys.p256dh}, auth = ${keys.auth}
  `;

  return NextResponse.json({ ok: true });
}
