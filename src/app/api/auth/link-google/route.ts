import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseEmailClient } from "@/lib/supabase";
import { createSession } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import type { AuthResponse } from "@/types/auth";

const LINK_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxAttempts: 5,
};

interface LinkGoogleBody {
  email: string;
  password: string;
  googleSupabaseUserId: string;
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
    const { allowed, retryAfterMs } = checkRateLimit(`link-google:${ip}`, LINK_RATE_LIMIT);

    if (!allowed) {
      const retryAfterSec = Math.ceil(retryAfterMs / 1000);
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Too many attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    const body = (await request.json()) as LinkGoogleBody;
    const { email, password, googleSupabaseUserId, fullName, avatarUrl } = body;

    if (!email || !password || !googleSupabaseUserId) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the password against Supabase Auth
    const supabase = createSupabaseEmailClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    // Password verified — link Google to the existing account
    const supabaseServer = createSupabaseServerClient();

    const { data: registration, error: regError } = await supabaseServer
      .from("brand_registrations")
      .select("id, full_name, profile_completed, auth_provider")
      .ilike("email", email)
      .maybeSingle();

    if (regError || !registration) {
      console.error("[link-google] Registration lookup failed:", regError);
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Account not found" },
        { status: 404 }
      );
    }

    // Update auth_provider to include google
    const currentProvider = registration.auth_provider || "email";
    const newProvider = currentProvider.includes("google")
      ? currentProvider
      : `${currentProvider},google`;

    const { error: updateError } = await supabaseServer
      .from("brand_registrations")
      .update({ auth_provider: newProvider })
      .eq("id", registration.id);

    if (updateError) {
      console.error("[link-google] Failed to update auth_provider:", updateError);
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
    console.error("[link-google] Unexpected error:", err);
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
