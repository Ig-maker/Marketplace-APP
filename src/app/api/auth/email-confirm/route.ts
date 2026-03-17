import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSession } from "@/lib/session";
import { notifySignup } from "@/lib/notify-signup";
import type { AuthResponse } from "@/types/auth";

interface EmailConfirmBody {
  supabaseUserId: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EmailConfirmBody;
    const { supabaseUserId, email, fullName, firstName, lastName } = body;

    if (!supabaseUserId || !email) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // Look up the registration saved during presave
    let { data, error } = await supabase
      .from("brand_registrations")
      .select("id, profile_completed, brand_name")
      .eq("supabase_user_id", supabaseUserId)
      .single();

    // If presave record doesn't exist (edge case), create it now
    if (error || !data) {
      const { data: inserted, error: insertError } = await supabase
        .from("brand_registrations")
        .insert({
          supabase_user_id: supabaseUserId,
          email,
          full_name: fullName || null,
          first_name: firstName || null,
          last_name: lastName || null,
          auth_provider: "email",
          profile_completed: false,
        })
        .select("id, profile_completed, brand_name")
        .single();

      if (insertError || !inserted) {
        console.error("[email-confirm] Could not find or create registration:", insertError);
        return NextResponse.json<AuthResponse>(
          { success: false, error: "Registration not found" },
          { status: 500 }
        );
      }

      data = inserted;
    }

    await createSession({
      id: data.id,
      email,
      name: fullName || email,
      role: "brand",
    });

    void notifySignup({
      email,
      fullName: fullName || undefined,
      role: "brand",
      authProvider: "email",
    });

    return NextResponse.json<AuthResponse & { profileCompleted: boolean }>({
      success: true,
      profileCompleted: data.profile_completed ?? false,
    });
  } catch (err) {
    console.error("[email-confirm] Unexpected error:", err);
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
