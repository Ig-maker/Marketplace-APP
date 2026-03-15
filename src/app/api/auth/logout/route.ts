import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

function clearAuthCookies(response: NextResponse): NextResponse {
  const isProduction = process.env.NODE_ENV === "production";
  const secure = isProduction ? "; Secure" : "";
  const base = `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  // Host-only cookie (no domain)
  response.headers.append("Set-Cookie", `${base}${secure}`);

  if (isProduction) {
    // Domain cookie variants — must use headers.append so each Set-Cookie
    // header is sent separately (response.cookies.set overwrites by name).
    response.headers.append("Set-Cookie", `${base}; Domain=.shelvian.co; Secure`);
    response.headers.append("Set-Cookie", `${base}; Domain=shelvian.co; Secure`);
  }

  return response;
}

export async function POST() {
  return clearAuthCookies(NextResponse.json({ success: true }));
}

export async function GET(request: NextRequest) {
  const rootUrl = new URL("/", request.url);
  return clearAuthCookies(NextResponse.redirect(rootUrl));
}
