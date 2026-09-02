import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readSessionToken } from "@/lib/auth";

// Fast, cookie-only check (no DB call — Proxy shouldn't do slow data
// fetching). This is an optimistic gate; pages still re-check via
// getCurrentMember() server-side for anything that actually matters.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/api/setup") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/manifest") ||
    /\.(png|ico|svg|jpg|jpeg)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("family_os_session")?.value;
  const session = readSessionToken(token);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
