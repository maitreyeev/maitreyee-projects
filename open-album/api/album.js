import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const ALBUM_ID = "demo";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    if (req.method === "GET") {
      const rows = await sql`
        SELECT album_name, open_link, cover_photo
        FROM open_album_settings WHERE id = ${ALBUM_ID}
      `;
      if (rows.length === 0) {
        return res.status(200).json({ albumName: "Meera & Arjun's Wedding", openLink: true, coverPhoto: null });
      }
      const row = rows[0];
      return res.status(200).json({
        albumName: row.album_name,
        openLink: row.open_link,
        coverPhoto: row.cover_photo,
      });
    }

    if (req.method === "PATCH") {
      const body = req.body || {};
      const sets = [];
      if (typeof body.albumName === "string") {
        await sql`UPDATE open_album_settings SET album_name = ${body.albumName.slice(0, 200)}, updated_at = now() WHERE id = ${ALBUM_ID}`;
        sets.push("albumName");
      }
      if (typeof body.openLink === "boolean") {
        await sql`UPDATE open_album_settings SET open_link = ${body.openLink}, updated_at = now() WHERE id = ${ALBUM_ID}`;
        sets.push("openLink");
      }
      if (typeof body.coverPhoto === "string") {
        await sql`UPDATE open_album_settings SET cover_photo = ${body.coverPhoto}, updated_at = now() WHERE id = ${ALBUM_ID}`;
        sets.push("coverPhoto");
      }
      return res.status(200).json({ ok: true, updated: sets });
    }

    res.setHeader("Allow", "GET, PATCH, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong on our end." });
  }
}
