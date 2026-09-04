CREATE TABLE IF NOT EXISTS shopping_items (
  id SERIAL PRIMARY KEY,
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity TEXT,
  is_checked BOOLEAN NOT NULL DEFAULT false,
  created_by INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_shopping_items_household ON shopping_items(household_id);
