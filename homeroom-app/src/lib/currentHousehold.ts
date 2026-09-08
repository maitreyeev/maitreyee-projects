import { getSession } from "./auth";

export async function getCurrentHouseholdId(): Promise<number | null> {
  const session = await getSession();
  return session?.householdId ?? null;
}
