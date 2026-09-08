"use server";

import { sql } from "@/lib/db";
import { verifySecret, createSession } from "@/lib/auth";

// Returns { error } instead of throwing. Next.js's production build
// redacts thrown Error messages from Server Actions (they render as an
// opaque "Minified React error #441" on the client, even though the
// real message reaches the server logs) — returning a plain value is the
// reliable way to get a validation message to the client in production.
export async function verifyPasscode(passcode: string): Promise<{ error?: string }> {
  const households = await sql`SELECT id, passcode_hash FROM households`;
  const match = (households as { id: number; passcode_hash: string }[]).find((h) =>
    verifySecret(passcode, h.passcode_hash)
  );
  if (!match) {
    return { error: "That passcode isn't right." };
  }
  await createSession(match.id);
  return {};
}
