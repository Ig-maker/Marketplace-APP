import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import type { LoginCredentials, AuthResponse } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginCredentials;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // TODO: Replace with real database lookup and password verification
    // This is a placeholder for development
    const user = {
      id: crypto.randomUUID(),
      email,
      name: email.split("@")[0],
      role: "brand" as const,
    };

    await createSession(user);

    return NextResponse.json<AuthResponse>({ success: true, user });
  } catch {
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
