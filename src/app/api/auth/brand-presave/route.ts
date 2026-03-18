import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

interface BrandPresaveBody {
  supabaseUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  brandName?: string;
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
    const body = (await request.json()) as BrandPresaveBody;
    const { supabaseUserId, email, firstName, lastName, fullName, brandName } = body;

    if (!supabaseUserId || !email) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const ip = getIpAddress(request);
    const device = detectDevice(request.headers.get("user-agent") ?? "");

    const { error } = await supabase.from("brand_registrations").upsert(
      {
        supabase_user_id: supabaseUserId,
        email,
        full_name: fullName || null,
        first_name: firstName || null,
        last_name: lastName || null,
        brand_name: brandName || null,
        ip_address: ip,
        device_type: device,
        auth_provider: "email",
        profile_completed: false,
      },
      { onConflict: "supabase_user_id", ignoreDuplicates: false }
    );

    if (error) {
      console.error("[brand-presave] Supabase error:", error);
      return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[brand-presave] Unexpected error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
