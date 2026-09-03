/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
const { neon } = require("@neondatabase/serverless");

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const raw = fs.readFileSync(path.join(__dirname, "..", "db", "migration-4-staff.sql"), "utf8");
  const noComments = raw
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
  const statements = noComments
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    await sql.query(stmt);
    console.log("OK:", stmt.slice(0, 80).replace(/\s+/g, " "));
  }
  console.log(`\nApplied ${statements.length} statements.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
