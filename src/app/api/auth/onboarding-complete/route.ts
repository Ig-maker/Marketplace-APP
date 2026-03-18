import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/session";
import type { AuthResponse } from "@/types/auth";

interface OnboardingCompleteBody {
  brandName?: string;
  category?: string;
  pitch?: string;
  retailer?: string;
  cities?: string;
  budget?: string;
  ambassadorRequirements?: string[];
  /** When true, marks profile as completed. Default true. */
  profileCompleted?: boolean;
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

    if (user.role !== "brand") {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Only brands can complete onboarding" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as OnboardingCompleteBody;
    const {
      brandName,
      category,
      pitch,
      retailer,
      cities,
      budget,
      ambassadorRequirements,
      profileCompleted = true,
    } = body;

    const supabase = createSupabaseServerClient();

    const updateData: Record<string, unknown> = {};
    if (brandName !== undefined) updateData.brand_name = brandName?.trim() || null;
    if (category !== undefined) updateData.category = category?.trim() || null;
    if (pitch !== undefined) updateData.pitch = pitch?.trim() || null;
    if (retailer !== undefined) updateData.retailer = retailer?.trim() || null;
    if (cities !== undefined) updateData.cities = cities?.trim() || null;
    if (budget !== undefined) updateData.budget = budget?.trim() || null;
    if (ambassadorRequirements !== undefined) {
      updateData.ambassador_requirements = Array.isArray(ambassadorRequirements)
        ? ambassadorRequirements
        : [];
    }
    if (profileCompleted) updateData.profile_completed = true;

    const { error } = await supabase
      .from("brand_registrations")
      .update(updateData)
      .eq("id", user.id);

    if (error) {
      console.error("[onboarding-complete] Supabase error:", error);
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Failed to save onboarding data" },
        { status: 500 }
      );
    }

    return NextResponse.json<AuthResponse>({ success: true });
  } catch (err) {
    console.error("[onboarding-complete] Unexpected error:", err);
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
