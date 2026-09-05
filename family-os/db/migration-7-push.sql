CREATE TABLE IF NOT EXISTS push_subscriptions (
  id SERIAL PRIMARY KEY,
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES family_members(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_household ON push_subscriptions(household_id);
