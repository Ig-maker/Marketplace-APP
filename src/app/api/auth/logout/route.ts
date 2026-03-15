import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { destroySession } from "@/lib/session";

function clearAuthCookies(response: NextResponse): NextResponse {
  const common = {
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
  };

  // Host-only cookie
  response.cookies.set(common);

  if (process.env.NODE_ENV === "production") {
    // Domain cookie variants
    response.cookies.set({ ...common, domain: ".shelvian.co", secure: true });
    response.cookies.set({ ...common, domain: "shelvian.co", secure: true });
  }

  return response;
}

export async function POST() {
  await destroySession();
  const response = NextResponse.json({ success: true });
  return clearAuthCookies(response);
}

export async function GET(request: NextRequest) {
  await destroySession();
  const response = NextResponse.redirect(new URL("/login", request.url));
  return clearAuthCookies(response);
}
