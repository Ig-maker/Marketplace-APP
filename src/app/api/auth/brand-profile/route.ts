import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/session";
import type { AuthResponse } from "@/types/auth";

interface BrandProfileBody {
  phone?: string;
  brandName: string;
  companyWebsite?: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as BrandProfileBody;
    const { phone, brandName, companyWebsite } = body;

    if (!brandName?.trim()) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Brand name is required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    const { error } = await supabase
      .from("brand_registrations")
      .update({
        phone: phone || null,
        brand_name: brandName.trim(),
        company_website: companyWebsite?.trim() || null,
        profile_completed: true,
      })
      .eq("id", user.id);

    if (error) {
      console.error("[brand-profile] Supabase update error:", error);
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Failed to save brand profile" },
        { status: 500 }
      );
    }

    return NextResponse.json<AuthResponse>({ success: true });
  } catch (err) {
    console.error("[brand-profile] Unexpected error:", err);
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
