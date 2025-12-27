import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        // Decode the base64 token
        let userData;
        try {
            const decoded = Buffer.from(token, 'base64').toString('utf-8');
            userData = JSON.parse(decoded);
        } catch (e) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Verify token hasn't expired (optional - add expiry check if needed)
        // For now, we'll just return success with user data

        return NextResponse.json({
            authenticated: true,
            user: {
                id: userData.userId,
                email: userData.email,
                role: userData.role,
            }
        });

    } catch (error: any) {
        console.error("[Mobile-Auth-Check] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
