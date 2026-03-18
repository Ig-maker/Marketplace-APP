import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSession } from "@/lib/session";
import { notifySignup } from "@/lib/notify-signup";
import type { AuthResponse } from "@/types/auth";

interface GoogleRegisterBody {
  supabaseUserId: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  rawMetadata?: Record<string, unknown>;
}

function detectDevice(userAgent: string): "mobile" | "desktop" | "unknown" {
  if (!userAgent) return "unknown";
  return /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent)
    ? "mobile"
    : "desktop";
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
    const body = (await request.json()) as GoogleRegisterBody;
    const { supabaseUserId, email, fullName, avatarUrl, rawMetadata } = body;
    let firstName = body.firstName ?? "";
    let lastName = body.lastName ?? "";

    // Fallback: derive first_name/last_name from fullName when Google doesn't provide them
    if ((!firstName || !lastName) && fullName) {
      const parts = fullName.trim().split(/\s+/);
      if (parts.length >= 1 && !firstName) firstName = parts[0];
      if (parts.length >= 2 && !lastName) lastName = parts.slice(1).join(" ");
    }

    if (!supabaseUserId || !email) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const ip = getIpAddress(request);
    const device = detectDevice(request.headers.get("user-agent") ?? "");

    const supabase = createSupabaseServerClient();

    // Upsert: preserve registered_at from the first signup by not including it
    // in the payload (the column DEFAULT NOW() handles first insert;
    // on conflict it is absent from the SET clause so it is never overwritten).
    const { data, error } = await supabase
      .from("brand_registrations")
      .upsert(
        {
          supabase_user_id: supabaseUserId,
          email,
          full_name: fullName || null,
          first_name: firstName || null,
          last_name: lastName || null,
          ip_address: ip,
          device_type: device,
          auth_provider: "google",
          raw_metadata: rawMetadata ?? null,
        },
        { onConflict: "supabase_user_id", ignoreDuplicates: false }
      )
      .select("id, profile_completed")
      .single();

    if (error || !data) {
      console.error("[google-register] Supabase upsert error:", error);
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Failed to save registration" },
        { status: 500 }
      );
    }

    // Create Shelvian app session
    await createSession({
      id: data.id,
      email,
      name: fullName || email,
      role: "brand",
      avatarUrl: avatarUrl || undefined,
    });

    void notifySignup({
      email,
      fullName: fullName || undefined,
      role: "brand",
      authProvider: "google",
    });

    return NextResponse.json<AuthResponse & { registrationId: string; profileCompleted: boolean }>({
      success: true,
      registrationId: data.id,
      profileCompleted: data.profile_completed ?? false,
    });
  } catch (err) {
    console.error("[google-register] Unexpected error:", err);
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
