import { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "./constants";
import type { Session } from "@/types/auth";

/**
 * Edge-compatible session reader for use in middleware.
 * Cannot use `cookies()` from next/headers in middleware,
 * so we read directly from the request.
 */
export function getSessionFromRequest(request: NextRequest): Session | null {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const json = atob(token.replace(/-/g, "+").replace(/_/g, "/"));
    const session = JSON.parse(json) as Session;
    if (session.expiresAt < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}
