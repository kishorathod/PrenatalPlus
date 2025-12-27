import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ error: "Authentication required. Please POST to /api/mobile-login" }, { status: 401 });
}
