import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        // Decode the base64 token
        let userData: any;
        try {
            const decoded = Buffer.from(token, 'base64').toString('utf-8');
            userData = JSON.parse(decoded);
        } catch (e) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const userId = userData.userId || userData.id;

        // Verify user exists in database
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            console.warn(`[Mobile-Auth] Stale token for non-existent user: ${userId}`);
            return NextResponse.json({ error: "User no longer exists" }, { status: 401 });
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });

    } catch (error: any) {
        console.error("[Mobile-Auth-Check] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
