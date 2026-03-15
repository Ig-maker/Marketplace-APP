import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".shelvian.co" : undefined,
  });
  return response;
}

export async function POST() {
  return clearSessionCookie(NextResponse.json({ success: true }));
}

export async function GET(request: NextRequest) {
  const rootUrl = new URL("/", request.url);
  return clearSessionCookie(NextResponse.redirect(rootUrl));
}
