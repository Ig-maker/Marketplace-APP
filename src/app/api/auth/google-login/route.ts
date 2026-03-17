import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSession } from "@/lib/session";
import { checkRateLimit, AUTH_RATE_LIMIT } from "@/lib/rate-limit";
import type { AuthResponse } from "@/types/auth";

interface GoogleLoginBody {
  supabaseUserId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

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
    const { allowed } = checkRateLimit(`google-login:${ip}`, AUTH_RATE_LIMIT);

    if (!allowed) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as GoogleLoginBody;
    const { supabaseUserId, email, fullName, avatarUrl } = body;

    if (!supabaseUserId || !email) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    const { data: registration } = await supabase
      .from("brand_registrations")
      .select("id, full_name, profile_completed")
      .eq("email", email)
      .maybeSingle();

    if (!registration) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "No account found with this Google email. Please sign up first." },
        { status: 401 }
      );
    }

    await createSession({
      id: registration.id,
      email,
      name: registration.full_name || fullName || email,
      role: "brand",
      avatarUrl: avatarUrl || undefined,
    });

    return NextResponse.json<AuthResponse & { profileCompleted: boolean }>({
      success: true,
      user: {
        id: registration.id,
        email,
        name: registration.full_name || fullName || email,
        role: "brand",
      },
      profileCompleted: registration.profile_completed ?? false,
    });
  } catch (err) {
    console.error("[google-login] Unexpected error:", err);
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
