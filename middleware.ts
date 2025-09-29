import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/signin", "/auth/error"];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // API routes that don't require authentication
  const publicApiRoutes = ["/api/auth"];
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Allow public routes and auth API routes
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next();
  }

  // Redirect to sign-in if not authenticated
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl));
  }

  // Admin-only routes
  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute && req.auth?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|manifest).*)"],
};
