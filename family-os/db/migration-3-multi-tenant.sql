-- Converts Family OS from a single hardcoded household to true
-- multi-tenancy: any number of households can share this deployment,
-- each with its own private data. Idempotent-ish (uses IF NOT EXISTS
-- / IF EXISTS where possible); safe to re-run.

-- household_auth.id was a fixed single row (id always 1). Turn it into
-- a real auto-incrementing id, continuing after the existing row.
ALTER TABLE household_auth DROP CONSTRAINT IF EXISTS single_row;
CREATE SEQUENCE IF NOT EXISTS household_auth_id_seq;
ALTER TABLE household_auth ALTER COLUMN id SET DEFAULT nextval('household_auth_id_seq');
SELECT setval('household_auth_id_seq', COALESCE((SELECT MAX(id) FROM household_auth), 0) + 1, false);
ALTER SEQUENCE household_auth_id_seq OWNED BY household_auth.id;

ALTER TABLE family_members ADD COLUMN IF NOT EXISTS household_id INTEGER;
UPDATE family_members SET household_id = 1 WHERE household_id IS NULL;
ALTER TABLE family_members ALTER COLUMN household_id SET NOT NULL;
ALTER TABLE family_members ADD CONSTRAINT fk_family_members_household FOREIGN KEY (household_id) REFERENCES household_auth(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_family_members_household_id ON family_members(household_id);

ALTER TABLE appointments ADD COLUMN IF NOT EXISTS household_id INTEGER;
UPDATE appointments SET household_id = 1 WHERE household_id IS NULL;
ALTER TABLE appointments ALTER COLUMN household_id SET NOT NULL;
ALTER TABLE appointments ADD CONSTRAINT fk_appointments_household FOREIGN KEY (household_id) REFERENCES household_auth(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_appointments_household_id ON appointments(household_id);

ALTER TABLE documents ADD COLUMN IF NOT EXISTS household_id INTEGER;
UPDATE documents SET household_id = 1 WHERE household_id IS NULL;
ALTER TABLE documents ALTER COLUMN household_id SET NOT NULL;
ALTER TABLE documents ADD CONSTRAINT fk_documents_household FOREIGN KEY (household_id) REFERENCES household_auth(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_documents_household_id ON documents(household_id);

ALTER TABLE medicines ADD COLUMN IF NOT EXISTS household_id INTEGER;
UPDATE medicines SET household_id = 1 WHERE household_id IS NULL;
ALTER TABLE medicines ALTER COLUMN household_id SET NOT NULL;
ALTER TABLE medicines ADD CONSTRAINT fk_medicines_household FOREIGN KEY (household_id) REFERENCES household_auth(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_medicines_household_id ON medicines(household_id);

ALTER TABLE financial_items ADD COLUMN IF NOT EXISTS household_id INTEGER;
UPDATE financial_items SET household_id = 1 WHERE household_id IS NULL;
ALTER TABLE financial_items ALTER COLUMN household_id SET NOT NULL;
ALTER TABLE financial_items ADD CONSTRAINT fk_financial_items_household FOREIGN KEY (household_id) REFERENCES household_auth(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_financial_items_household_id ON financial_items(household_id);

ALTER TABLE travel_trips ADD COLUMN IF NOT EXISTS household_id INTEGER;
UPDATE travel_trips SET household_id = 1 WHERE household_id IS NULL;
ALTER TABLE travel_trips ALTER COLUMN household_id SET NOT NULL;
ALTER TABLE travel_trips ADD CONSTRAINT fk_travel_trips_household FOREIGN KEY (household_id) REFERENCES household_auth(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_travel_trips_household_id ON travel_trips(household_id);

ALTER TABLE travel_expenses ADD COLUMN IF NOT EXISTS household_id INTEGER;
UPDATE travel_expenses SET household_id = 1 WHERE household_id IS NULL;
ALTER TABLE travel_expenses ALTER COLUMN household_id SET NOT NULL;
ALTER TABLE travel_expenses ADD CONSTRAINT fk_travel_expenses_household FOREIGN KEY (household_id) REFERENCES household_auth(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_travel_expenses_household_id ON travel_expenses(household_id);

ALTER TABLE emergency_contacts ADD COLUMN IF NOT EXISTS household_id INTEGER;
UPDATE emergency_contacts SET household_id = 1 WHERE household_id IS NULL;
ALTER TABLE emergency_contacts ALTER COLUMN household_id SET NOT NULL;
ALTER TABLE emergency_contacts ADD CONSTRAINT fk_emergency_contacts_household FOREIGN KEY (household_id) REFERENCES household_auth(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_household_id ON emergency_contacts(household_id);

ALTER TABLE household_tasks ADD COLUMN IF NOT EXISTS household_id INTEGER;
UPDATE household_tasks SET household_id = 1 WHERE household_id IS NULL;
ALTER TABLE household_tasks ALTER COLUMN household_id SET NOT NULL;
ALTER TABLE household_tasks ADD CONSTRAINT fk_household_tasks_household FOREIGN KEY (household_id) REFERENCES household_auth(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_household_tasks_household_id ON household_tasks(household_id);

ALTER TABLE important_dates ADD COLUMN IF NOT EXISTS household_id INTEGER;
UPDATE important_dates SET household_id = 1 WHERE household_id IS NULL;
ALTER TABLE important_dates ALTER COLUMN household_id SET NOT NULL;
ALTER TABLE important_dates ADD CONSTRAINT fk_important_dates_household FOREIGN KEY (household_id) REFERENCES household_auth(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_important_dates_household_id ON important_dates(household_id);

ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS household_id INTEGER;
UPDATE activity_log SET household_id = 1 WHERE household_id IS NULL;
ALTER TABLE activity_log ALTER COLUMN household_id SET NOT NULL;
ALTER TABLE activity_log ADD CONSTRAINT fk_activity_log_household FOREIGN KEY (household_id) REFERENCES household_auth(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_activity_log_household_id ON activity_log(household_id);
