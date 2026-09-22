import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const ALBUM_ID = "demo";
const MAX_THUMBS_PER_UPLOAD = 12;

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    if (req.method === "GET") {
      const rows = await sql`
        SELECT id, guest_name, photo_count, thumbs, created_at
        FROM open_album_contributions
        WHERE album_id = ${ALBUM_ID}
        ORDER BY created_at ASC
        LIMIT 500
      `;
      return res.status(200).json(
        rows.map((r) => ({
          id: r.id,
          name: r.guest_name,
          count: r.photo_count,
          thumbs: r.thumbs,
          addedAt: new Date(r.created_at).getTime(),
        }))
      );
    }

    if (req.method === "POST") {
      const body = req.body || {};
      const name = typeof body.name === "string" && body.name.trim() ? body.name.trim().slice(0, 60) : "A guest";
      const count = Number.isFinite(body.count) ? Math.max(0, Math.min(999, Math.trunc(body.count))) : 0;
      const thumbs = Array.isArray(body.thumbs)
        ? body.thumbs.filter((t) => typeof t === "string" && t.startsWith("data:image/")).slice(0, MAX_THUMBS_PER_UPLOAD)
        : [];
      if (count === 0) {
        return res.status(400).json({ error: "No photos in this upload." });
      }

      const rows = await sql`
        INSERT INTO open_album_contributions (album_id, guest_name, photo_count, thumbs)
        VALUES (${ALBUM_ID}, ${name}, ${count}, ${JSON.stringify(thumbs)}::jsonb)
        RETURNING id, created_at
      `;
      return res.status(201).json({ ok: true, id: rows[0].id, addedAt: new Date(rows[0].created_at).getTime() });
    }

    if (req.method === "DELETE") {
      await sql`DELETE FROM open_album_contributions WHERE album_id = ${ALBUM_ID}`;
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST, DELETE, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong on our end." });
  }
}
