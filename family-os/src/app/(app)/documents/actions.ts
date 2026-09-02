"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { uploadFile, deleteFile } from "@/lib/blob";
import { revalidatePath } from "next/cache";

export async function addDocument(formData: FormData) {
  const me = await getCurrentMember();
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
    INSERT INTO documents (title, category, file_path, file_name, expiry_date, family_member_id, created_by)
    VALUES (${title}, ${category}, ${filePath}, ${fileName}, ${expiryDate}, ${familyMemberId}, ${me?.id ?? null})
  `;
  revalidatePath("/documents");
}

export async function deleteDocument(id: number) {
  const rows = await sql`SELECT file_path FROM documents WHERE id = ${id}`;
  if (rows[0]?.file_path) await deleteFile(rows[0].file_path as string);
  await sql`DELETE FROM documents WHERE id = ${id}`;
  revalidatePath("/documents");
}
