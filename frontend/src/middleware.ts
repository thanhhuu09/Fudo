// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  if (!refreshToken && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/dashboard/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
