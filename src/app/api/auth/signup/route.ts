import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import type { AuthResponse } from "@/types/auth";

interface SignupBody {
  email: string;
  password: string;
  name: string;
  role: "brand" | "ambassador";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignupBody;
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // TODO: Replace with real user creation (hash password, store in DB)
    const user = {
      id: crypto.randomUUID(),
      email,
      name,
      role,
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
