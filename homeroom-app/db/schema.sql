-- Homeroom schema. One passcode-gated household per account; each
-- household can have multiple children, each with their own age/board,
-- completed-topic tracking, and journal. Login works by scanning
-- households for a passcode match (no subdomain/slug per household —
-- one shared URL for everyone), so signup enforces passcode uniqueness.

CREATE TABLE IF NOT EXISTS households (
  id SERIAL PRIMARY KEY,
  passcode_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS children (
  id SERIAL PRIMARY KEY,
  household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age BETWEEN 3 AND 16),
  board_id TEXT NOT NULL CHECK (board_id IN ('cbse', 'icse', 'igcse', 'ib')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS completed_topics (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (child_id, topic_id)
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  note TEXT NOT NULL,
  photo_data_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_children_household ON children(household_id);
CREATE INDEX IF NOT EXISTS idx_completed_topics_child ON completed_topics(child_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_child ON journal_entries(child_id);
