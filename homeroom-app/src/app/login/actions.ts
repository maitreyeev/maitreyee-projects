"use server";

import { sql } from "@/lib/db";
import { verifySecret, createSession } from "@/lib/auth";

// Deliberately does not call redirect() here: this is invoked from a client
// component inside a try/catch for error display, and redirect()'s internal
// throw would otherwise get swallowed as a fake "error". The client
// navigates itself after a successful await instead.
export async function verifyPasscode(passcode: string) {
  const households = await sql`SELECT id, passcode_hash FROM households`;
  const match = (households as { id: number; passcode_hash: string }[]).find((h) =>
    verifySecret(passcode, h.passcode_hash)
  );
  if (!match) {
    throw new Error("That passcode isn't right.");
  }
  await createSession(match.id);
}
