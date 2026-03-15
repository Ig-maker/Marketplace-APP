import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true, v: 5 });
}

export async function GET(request: NextRequest) {
  await destroySession();
  const rootUrl = new URL("/", request.url);
  return NextResponse.redirect(rootUrl);
}
