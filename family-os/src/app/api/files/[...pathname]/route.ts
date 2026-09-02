import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { fetchFile } from "@/lib/blob";

// The only way any family document is ever readable — gated behind a valid
// household session, streamed server-side rather than exposing a public
// blob URL.
export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/files/[...pathname]">
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { pathname } = await ctx.params;
  const fullPath = pathname.join("/");
  const result = await fetchFile(fullPath);
  if (!result) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  return new NextResponse(result.stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${encodeURIComponent(fullPath.split("/").pop() || "file")}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
