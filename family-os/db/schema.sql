-- Family OS schema.
--
-- Multi-tenant: this single deployment can serve any number of
-- households. Every domain table carries a household_id so each
-- household's data is fully isolated from every other's. Login works
-- by scanning household_auth for a passcode match (there's no
-- subdomain/slug per household — one shared URL for everyone), so
-- setup enforces passcode uniqueness across households.

CREATE TABLE IF NOT EXISTS household_auth (
  id SERIAL PRIMARY KEY,
  household_name TEXT NOT NULL,
  passcode_hash TEXT NOT NULL,
  parent_pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS family_members (
  id SERIAL PRIMARY KEY,
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('parent', 'child', 'grandparent', 'other')),
  emoji TEXT NOT NULL DEFAULT '🙂',
  color TEXT NOT NULL DEFAULT '#8B7CF6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
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
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
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
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
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
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
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
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
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
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
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
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
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
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
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
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
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
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
  actor_id INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  actor_name TEXT,
  actor_emoji TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_family_members_household_id ON family_members(household_id);
CREATE INDEX IF NOT EXISTS idx_appointments_household_id ON appointments(household_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_documents_household_id ON documents(household_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_medicines_household_id ON medicines(household_id);
CREATE INDEX IF NOT EXISTS idx_financial_items_household_id ON financial_items(household_id);
CREATE INDEX IF NOT EXISTS idx_financial_items_due_date ON financial_items(due_date);
CREATE INDEX IF NOT EXISTS idx_financial_items_type ON financial_items(type);
CREATE INDEX IF NOT EXISTS idx_travel_trips_household_id ON travel_trips(household_id);
CREATE INDEX IF NOT EXISTS idx_travel_expenses_household_id ON travel_expenses(household_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_household_id ON emergency_contacts(household_id);
CREATE INDEX IF NOT EXISTS idx_household_tasks_household_id ON household_tasks(household_id);
CREATE INDEX IF NOT EXISTS idx_household_tasks_due_date ON household_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_important_dates_household_id ON important_dates(household_id);
CREATE INDEX IF NOT EXISTS idx_important_dates_date ON important_dates(date);
CREATE INDEX IF NOT EXISTS idx_activity_log_household_id ON activity_log(household_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);
