import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from "./constants";
import type { Session, User } from "@/types/auth";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-in-production";

function encode(data: Session): string {
  const json = JSON.stringify(data);
  return Buffer.from(json).toString("base64url");
}

function decode(token: string): Session | null {
  try {
    const json = Buffer.from(token, "base64url").toString("utf-8");
    const session = JSON.parse(json) as Session;
    if (session.expiresAt < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function createSession(user: User): Promise<void> {
  const session: Session = {
    user,
    expiresAt: Date.now() + AUTH_COOKIE_MAX_AGE * 1000,
  };

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, encode(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".shelvian.co" : undefined,
  });
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return decode(token);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  // Host-only variant
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });

  if (secure) {
    // Domain variant used by current cookie config
    cookieStore.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 0,
      expires: new Date(0),
      path: "/",
      domain: ".shelvian.co",
    });

    // Backward compatibility variant without leading dot
    cookieStore.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 0,
      expires: new Date(0),
      path: "/",
      domain: "shelvian.co",
    });
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}
