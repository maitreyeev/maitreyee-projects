import webpush from "web-push";
import { sql } from "./db";

webpush.setVapidDetails(
  "mailto:maitreyee@karmalife.ai",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/** Sends a push notification to every device subscribed for a household,
 *  pruning subscriptions the push service reports as gone (410/404). */
export async function sendPushToHousehold(householdId: number, payload: PushPayload) {
  const subs = await sql`
    SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE household_id = ${householdId}
  `;

  await Promise.all(
    (subs as { id: number; endpoint: string; p256dh: string; auth: string }[]).map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload)
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await sql`DELETE FROM push_subscriptions WHERE id = ${sub.id}`;
        }
      }
    })
  );
}
