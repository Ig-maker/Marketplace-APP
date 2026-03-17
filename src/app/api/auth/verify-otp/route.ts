import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { checkRateLimit, OTP_RATE_LIMIT } from "@/lib/rate-limit";
import type { OtpVerifyRequest, AuthResponse } from "@/types/auth";

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
    const { allowed, retryAfterMs } = checkRateLimit(`verify-otp:${ip}`, OTP_RATE_LIMIT);

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

    const body = (await request.json()) as OtpVerifyRequest;
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Phone and code are required" },
        { status: 400 }
      );
    }

    // TODO: Replace with real OTP verification
    // For development, accept code "123456"
    if (code !== "123456") {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Invalid verification code" },
        { status: 401 }
      );
    }

    const user = {
      id: crypto.randomUUID(),
      email: "",
      name: `Ambassador ${phone.slice(-4)}`,
      role: "ambassador" as const,
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
