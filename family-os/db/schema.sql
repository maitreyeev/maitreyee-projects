-- Family OS schema.
--
-- Single-household deployment: this instance of the app serves exactly one
-- family, so there is no household/tenant table — every domain table is
-- just a flat list scoped to "this household". The household's shared
-- passcode and parent PIN live in the `household_auth` table (hashed),
-- set once during first-run setup.

CREATE TABLE IF NOT EXISTS household_auth (
  id INTEGER PRIMARY KEY DEFAULT 1,
  household_name TEXT NOT NULL,
  passcode_hash TEXT NOT NULL,
  parent_pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS family_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('parent', 'child', 'grandparent', 'other')),
  emoji TEXT NOT NULL DEFAULT '🙂',
  color TEXT NOT NULL DEFAULT '#8B7CF6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  family_member_id INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  notes TEXT,
  created_by INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  family_member_id INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('medical', 'school', 'insurance', 'warranty', 'travel', 'general')),
  title TEXT NOT NULL,
  file_path TEXT,
  file_name TEXT,
  expiry_date DATE,
  notes TEXT,
  created_by INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS medicines (
  id SERIAL PRIMARY KEY,
  family_member_id INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  dosage TEXT,
  schedule TEXT,
  refill_date DATE,
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS financial_items (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('bill', 'subscription', 'insurance', 'warranty', 'obligation')),
  title TEXT NOT NULL,
  provider TEXT,
  amount NUMERIC(12, 2),
  due_date DATE,
  recurring TEXT NOT NULL DEFAULT 'none' CHECK (recurring IN ('none', 'weekly', 'monthly', 'yearly')),
  is_paid BOOLEAN NOT NULL DEFAULT false,
  document_id INTEGER REFERENCES documents(id) ON DELETE SET NULL,
  notes TEXT,
  created_by INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS travel_trips (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_by INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS travel_expenses (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES travel_trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  date DATE,
  notes TEXT,
  created_by INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS emergency_contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  relation TEXT,
  phone TEXT NOT NULL,
  notes TEXT,
  created_by INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS household_tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  assigned_to INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  due_date DATE,
  recurring TEXT NOT NULL DEFAULT 'none' CHECK (recurring IN ('none', 'daily', 'weekly', 'monthly')),
  is_done BOOLEAN NOT NULL DEFAULT false,
  created_by INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS important_dates (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  recurring_yearly BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_by INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS activity_log (
  id SERIAL PRIMARY KEY,
  actor_id INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  actor_name TEXT,
  actor_emoji TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_financial_items_due_date ON financial_items(due_date);
CREATE INDEX IF NOT EXISTS idx_financial_items_type ON financial_items(type);
CREATE INDEX IF NOT EXISTS idx_household_tasks_due_date ON household_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_important_dates_date ON important_dates(date);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);
