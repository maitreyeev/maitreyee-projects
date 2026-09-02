"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { uploadFile, deleteFile } from "@/lib/blob";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function addDocument(formData: FormData) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "general");
  const expiryDate = String(formData.get("expiryDate") || "") || null;
  const familyMemberIdRaw = String(formData.get("familyMemberId") || "");
  const familyMemberId = familyMemberIdRaw ? Number(familyMemberIdRaw) : null;
  const file = formData.get("file") as File | null;

  if (!title) throw new Error("Title is required.");

  let filePath: string | null = null;
  let fileName: string | null = null;
  if (file && file.size > 0) {
    const uploaded = await uploadFile(file, "documents");
    filePath = uploaded.pathname;
    fileName = uploaded.name;
  }

  await sql`
    INSERT INTO documents (household_id, title, category, file_path, file_name, expiry_date, family_member_id, created_by)
    VALUES (${me.householdId}, ${title}, ${category}, ${filePath}, ${fileName}, ${expiryDate}, ${familyMemberId}, ${me.id})
  `;
  await logActivity("added", "document", title);
  revalidatePath("/documents");
}

export async function deleteDocument(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE documents SET deleted_at = now() WHERE id = ${id} AND household_id = ${me.householdId} RETURNING title
  `;
  if (rows[0]) await logActivity("deleted", "document", rows[0].title as string);
  revalidatePath("/documents");
  revalidatePath("/trash");
}

export async function restoreDocument(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE documents SET deleted_at = NULL WHERE id = ${id} AND household_id = ${me.householdId} RETURNING title
  `;
  if (rows[0]) await logActivity("restored", "document", rows[0].title as string);
  revalidatePath("/documents");
  revalidatePath("/trash");
}

export async function permanentlyDeleteDocument(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`SELECT file_path FROM documents WHERE id = ${id} AND household_id = ${me.householdId}`;
  if (rows[0]?.file_path) await deleteFile(rows[0].file_path as string);
  await sql`DELETE FROM documents WHERE id = ${id} AND household_id = ${me.householdId}`;
  revalidatePath("/trash");
}
