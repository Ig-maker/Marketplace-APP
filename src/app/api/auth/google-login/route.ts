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

    // 1. Look up by Google supabase_user_id — means Google was already linked
    const { data: byUserId, error: userIdError } = await supabase
      .from("brand_registrations")
      .select("id, full_name, profile_completed, auth_provider")
      .eq("supabase_user_id", supabaseUserId)
      .maybeSingle();

    if (userIdError) {
      console.error("[google-login] Supabase query error (by user_id):", userIdError);
    }

    if (byUserId) {
      await createSession({
        id: byUserId.id,
        email,
        name: byUserId.full_name || fullName || email,
        role: "brand",
        avatarUrl: avatarUrl || undefined,
      });

      return NextResponse.json<AuthResponse & { profileCompleted: boolean }>({
        success: true,
        user: {
          id: byUserId.id,
          email,
          name: byUserId.full_name || fullName || email,
          role: "brand",
        },
        profileCompleted: byUserId.profile_completed ?? false,
      });
    }

    // 2. Fall back to case-insensitive email lookup
    const { data: byEmail, error: emailError } = await supabase
      .from("brand_registrations")
      .select("id, full_name, profile_completed, auth_provider")
      .ilike("email", email)
      .maybeSingle();

    if (emailError) {
      console.error("[google-login] Supabase query error (by email):", emailError);
    }

    if (!byEmail) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "No account found with this Google email. Please sign up first." },
        { status: 401 }
      );
    }

    // 3. Account exists — check if Google is already an auth provider
    const provider = byEmail.auth_provider || "";
    const hasGoogle = provider.includes("google");

    if (!hasGoogle) {
      // Email-only account needs password verification before linking
      return NextResponse.json(
        {
          success: false,
          code: "LINKING_REQUIRED",
          error: "An account with this email already exists. Please verify your identity to link Google.",
        },
        { status: 409 }
      );
    }

    // Google is already a provider — log in
    await createSession({
      id: byEmail.id,
      email,
      name: byEmail.full_name || fullName || email,
      role: "brand",
      avatarUrl: avatarUrl || undefined,
    });

    return NextResponse.json<AuthResponse & { profileCompleted: boolean }>({
      success: true,
      user: {
        id: byEmail.id,
        email,
        name: byEmail.full_name || fullName || email,
        role: "brand",
      },
      profileCompleted: byEmail.profile_completed ?? false,
    });
  } catch (err) {
    console.error("[google-login] Unexpected error:", err);
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
