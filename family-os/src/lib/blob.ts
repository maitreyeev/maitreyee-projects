import { put, del, get } from "@vercel/blob";

// Every file — medical records, insurance papers, report cards — is stored
// private. Nothing is ever reachable via a guessable public URL; the only
// way to read a file back is through /api/files, which checks for a valid
// household session first (see src/app/api/files/[...pathname]/route.ts).

export async function uploadFile(file: File, folder: string) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const pathname = `${folder}/${Date.now()}-${safeName}`;
  const blob = await put(pathname, file, {
    access: "private",
    addRandomSuffix: true,
  });
  return { pathname: blob.pathname, name: file.name };
}

export async function fetchFile(pathname: string) {
  return get(pathname, { access: "private" });
}

export async function deleteFile(pathname: string) {
  try {
    await del(pathname);
  } catch {
    // File already gone — not worth failing the surrounding delete over.
  }
}
