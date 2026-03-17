import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseEmailClient } from "@/lib/supabase";
import { checkRateLimit, AUTH_RATE_LIMIT } from "@/lib/rate-limit";
import type { LoginCredentials, AuthResponse } from "@/types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getIpAddress(request: NextRequest): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    const ip = getIpAddress(request);
    const { allowed, retryAfterMs } = checkRateLimit(`login:${ip}`, AUTH_RATE_LIMIT);

    if (!allowed) {
      const retryAfterSec = Math.ceil(retryAfterMs / 1000);
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    const body = (await request.json()) as LoginCredentials;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseEmailClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      const supabaseServer = createSupabaseServerClient();
      const { data: registration } = await supabaseServer
        .from("brand_registrations")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (!registration) {
        return NextResponse.json<AuthResponse>(
          { success: false, error: "Account not found. Please sign up first." },
          { status: 401 }
        );
      }

      return NextResponse.json<AuthResponse>(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const supabaseServer = createSupabaseServerClient();
    const { data: registration } = await supabaseServer
      .from("brand_registrations")
      .select("id, full_name, brand_name")
      .eq("email", email)
      .maybeSingle();

    const userName =
      registration?.full_name ||
      authData.user.user_metadata?.full_name ||
      email.split("@")[0];

    await createSession({
      id: registration?.id || authData.user.id,
      email,
      name: userName,
      role: "brand",
      avatarUrl: authData.user.user_metadata?.avatar_url || undefined,
    });

    return NextResponse.json<AuthResponse>({
      success: true,
      user: {
        id: registration?.id || authData.user.id,
        email,
        name: userName,
        role: "brand",
      },
    });
  } catch (err) {
    console.error("[login] Unexpected error:", err);
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
