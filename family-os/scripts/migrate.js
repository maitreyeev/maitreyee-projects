/* eslint-disable @typescript-eslint/no-require-imports */
// One-off migration runner: applies db/schema.sql to the connected Neon
// database. Safe to re-run — every statement uses IF NOT EXISTS.
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
const { neon } = require("@neondatabase/serverless");

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const schema = fs.readFileSync(path.join(__dirname, "..", "db", "schema.sql"), "utf8");
  // Neon's tagged-template client runs one statement per call; split on
  // semicolons at line-end (schema.sql has no semicolons inside strings).
  const statements = schema
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    await sql.query(stmt);
    console.log("OK:", stmt.slice(0, 70).replace(/\s+/g, " "));
  }
  console.log(`\nApplied ${statements.length} statements.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
