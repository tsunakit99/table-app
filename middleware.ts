import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // サインイン画面は除外
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Cookie にセッションがなければリダイレクト
  const hasSession = req.cookies.get("authjs.session-token");
  if (!hasSession) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sw\\.js|workbox-.*\\.js|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    "/", // トップページも含める
    "/dashboard/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
