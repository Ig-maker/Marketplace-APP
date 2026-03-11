import { NextRequest, NextResponse } from "next/server";
import type { PhoneLoginRequest } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
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
