import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { AuthResponse } from "@/types/auth";

interface SignupBody {
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: "brand" | "ambassador";
  phone?: string;
  brandName?: string;
  companyWebsite?: string;
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
    const body = (await request.json()) as SignupBody;
    const { email, password, name, firstName, lastName, role, phone, brandName, companyWebsite } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const userId = crypto.randomUUID();

    // Save brand registration to Supabase
    if (role === "brand") {
      try {
        const supabase = createSupabaseServerClient();
        const ip = getIpAddress(request);
        const device = detectDevice(request.headers.get("user-agent") ?? "");

        await supabase.from("brand_registrations").insert({
          id: userId,
          email,
          full_name: name,
          first_name: firstName || name.split(" ")[0] || null,
          last_name: lastName || name.split(" ").slice(1).join(" ") || null,
          phone: phone || null,
          brand_name: brandName || null,
          company_website: companyWebsite || null,
          ip_address: ip,
          device_type: device,
          auth_provider: "email",
          registered_at: new Date().toISOString(),
          profile_completed: !!(brandName),
        });
      } catch (supabaseErr) {
        // Log but don't fail the signup if Supabase is not yet configured
        console.warn("[signup] Supabase insert skipped:", supabaseErr);
      }
    }

    // TODO: Replace with real password hashing + user storage
    const user = {
      id: userId,
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
