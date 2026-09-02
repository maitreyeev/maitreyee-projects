import { neon } from "@neondatabase/serverless";

// Single shared serverless client — Neon's driver is HTTP-based and safe to
// reuse across server-action/route invocations without connection pooling
// concerns.
export const sql = neon(process.env.DATABASE_URL!);
