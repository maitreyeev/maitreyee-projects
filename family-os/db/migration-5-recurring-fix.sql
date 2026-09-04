-- Household staff salary tracking previously used a plain boolean
-- (is_paid_this_month) with no month attached, so it never reset month
-- to month. Replace it with a text column recording which month was
-- actually paid, so "paid" can be computed by comparing to the current
-- month instead of drifting stale forever.
ALTER TABLE household_staff ADD COLUMN IF NOT EXISTS salary_paid_month TEXT;

UPDATE household_staff
SET salary_paid_month = to_char(now() AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM')
WHERE is_paid_this_month = true AND salary_paid_month IS NULL;
