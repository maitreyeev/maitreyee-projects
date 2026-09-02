/* eslint-disable @typescript-eslint/no-require-imports */
// One-off migration runner for db/migration-2-trash-activity.sql. Safe to
// re-run — every statement uses IF NOT EXISTS.
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
const { neon } = require("@neondatabase/serverless");

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const file = fs.readFileSync(path.join(__dirname, "..", "db", "migration-2-trash-activity.sql"), "utf8");
  const statements = file
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("--"));
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
