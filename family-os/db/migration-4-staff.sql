CREATE TABLE IF NOT EXISTS household_staff (
  id SERIAL PRIMARY KEY,
  household_id INTEGER NOT NULL REFERENCES household_auth(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('maid', 'cook', 'driver', 'nanny', 'gardener', 'cleaner', 'other')),
  phone TEXT,
  monthly_salary NUMERIC(12, 2),
  salary_due_day INTEGER CHECK (salary_due_day BETWEEN 1 AND 31),
  is_paid_this_month BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_by INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_household_staff_household_id ON household_staff(household_id);
