import { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

function buildClearCookie(): string {
  const parts = [
    `${AUTH_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ];

  if (process.env.NODE_ENV === "production") {
    parts.push("Domain=.shelvian.co", "Secure");
  }

  return parts.join("; ");
}

export async function POST() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": buildClearCookie(),
    },
  });
}

export async function GET(request: NextRequest) {
  const rootUrl = new URL("/", request.url);
  return new Response(null, {
    status: 307,
    headers: {
      Location: rootUrl.toString(),
      "Set-Cookie": buildClearCookie(),
    },
  });
}
