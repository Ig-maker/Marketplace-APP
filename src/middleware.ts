import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session-edge";
import { PUBLIC_ROUTES, DEFAULT_REDIRECT } from "@/lib/constants";

const PROTECTED_PATHS = ["/dashboard", "/settings", "/billing", "/onboarding", "/brand"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSessionFromRequest(request);
  const isLoggedIn = session !== null;

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Rule: Root path redirect
  if (pathname === "/") {
    const target = isLoggedIn ? DEFAULT_REDIRECT : "/login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Rule: Logged-in user visits /login or /signup → redirect to /dashboard
  if (isLoggedIn && PUBLIC_ROUTES.includes(pathname as typeof PUBLIC_ROUTES[number])) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }

  // Rule: Logged-out user visits protected route → redirect to /login?redirect=<original>
  if (!isLoggedIn && PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rule: Brand user visits /dashboard → redirect to /brand/demo-dashboard
  if (isLoggedIn && pathname === "/dashboard" && session?.user?.role === "brand") {
    return NextResponse.redirect(new URL("/brand/demo-dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
