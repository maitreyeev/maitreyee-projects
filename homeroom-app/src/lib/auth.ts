import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto";
import { cookies } from "next/headers";

// --- Secret hashing (household passcode) -----------------------------------
// scrypt with a random per-secret salt; no extra dependency needed since
// this is all built into Node's crypto module.

export function hashSecret(secret: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(secret, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifySecret(secret: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(secret, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

// --- Session cookies ---------------------------------------------------
// Lightweight signed cookie (no JWT library needed): base64url(payload) +
// "." + HMAC-SHA256 signature, keyed off the database password already
// embedded in DATABASE_URL — unique per deployment, never exposed
// client-side, so there's no separate secret to generate or manage.

function sessionKey(): string {
  return process.env.DATABASE_URL || "homeroom-fallback-key";
}

function sign(payload: string): string {
  return createHmac("sha256", sessionKey()).update(payload).digest("base64url");
}

interface SessionPayload {
  householdId: number;
  exp: number; // epoch ms
}

const COOKIE_NAME = "homeroom_session";
const SESSION_DAYS = 180;

export async function createSession(householdId: number) {
  const payload: SessionPayload = {
    householdId,
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const token = `${encoded}.${sign(encoded)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export function readSessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  if (sig !== sign(encoded)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as SessionPayload;
    if (typeof payload.householdId !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return readSessionToken(store.get(COOKIE_NAME)?.value);
}
