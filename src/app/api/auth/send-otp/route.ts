import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, OTP_RATE_LIMIT } from "@/lib/rate-limit";
import type { PhoneLoginRequest } from "@/types/auth";

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
    const { allowed, retryAfterMs } = checkRateLimit(`otp:${ip}`, OTP_RATE_LIMIT);

    if (!allowed) {
      const retryAfterSec = Math.ceil(retryAfterMs / 1000);
      return NextResponse.json(
        { success: false, error: "Too many attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    const body = (await request.json()) as PhoneLoginRequest;
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    // TODO: Integrate with SMS provider (Twilio, etc.)
    // For development, any OTP code will work in verify-otp
    console.log(`[DEV] OTP sent to ${phone}: 123456`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
