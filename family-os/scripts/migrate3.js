/* eslint-disable @typescript-eslint/no-require-imports */
// One-off migration runner for db/migration-3-multi-tenant.sql. Strips
// full-line comments before splitting on ";" (a prior migration script
// accidentally swallowed a statement by splitting on ";\n" while a
// leading comment block was still attached to it — this version avoids
// that by stripping comment lines first).
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
const { neon } = require("@neondatabase/serverless");

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const raw = fs.readFileSync(path.join(__dirname, "..", "db", "migration-3-multi-tenant.sql"), "utf8");
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
