import { NextRequest, NextResponse } from "next/server";
import { createSupabaseEmailClient } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";
import type { AuthResponse } from "@/types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RESET_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxAttempts: 5,
};

function getIpAddress(request: NextRequest): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function resolveOrigin(request: NextRequest): string {
  const candidates = [
    request.headers.get("origin"),
    process.env.NEXT_PUBLIC_APP_URL,
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const trimmed = raw.trim();
    if (/^https?:\/\//.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  return "http://localhost:3000";
}

export async function POST(request: NextRequest) {
  try {
    const ip = getIpAddress(request);
    const { allowed, retryAfterMs } = checkRateLimit(
      `forgot-password:${ip}`,
      RESET_RATE_LIMIT
    );

    if (!allowed) {
      const retryAfterSec = Math.ceil(retryAfterMs / 1000);
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    const { email } = (await request.json()) as { email: string };

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const origin = resolveOrigin(request);

    const supabase = createSupabaseEmailClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });

    if (error) {
      console.error("[forgot-password] Supabase error:", error.message);
    }

    // Always return success — never reveal whether the email exists
    return NextResponse.json<AuthResponse>({ success: true });
  } catch (err) {
    console.error("[forgot-password] Unexpected error:", err);
    return NextResponse.json<AuthResponse>({ success: true });
  }
}
