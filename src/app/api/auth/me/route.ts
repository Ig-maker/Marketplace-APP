import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  // For brand users, enrich with brand_name from Supabase
  let brandName: string | null = null;
  if (user.role === "brand") {
    try {
      const supabase = createSupabaseServerClient();
      const { data } = await supabase
        .from("brand_registrations")
        .select("brand_name")
        .eq("id", user.id)
        .single();
      brandName = data?.brand_name ?? null;
    } catch {
      // Supabase not configured or row not found — silently ignore
    }
  }

  return NextResponse.json({ success: true, user, brandName });
}
