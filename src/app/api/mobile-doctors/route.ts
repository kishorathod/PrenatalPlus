import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/server/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        let userId: string | undefined;

        // 1. Prioritize Bearer token for Mobile requests
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            try {
                const decoded = Buffer.from(token, 'base64').toString('utf-8');
                const userData = JSON.parse(decoded);
                userId = userData.userId || userData.id;
                console.log("[Mobile-Doctors] Authenticated via Bearer token:", userId);
            } catch (e) {
                console.error("[Mobile-Doctors] Token decode error:", e);
                return NextResponse.json({ error: "Invalid token" }, { status: 401 });
            }
        }

        // 2. Fallback to standard NextAuth session
        if (!userId) {
            const session = await auth();
            userId = session?.user?.id;
            if (userId) console.log("[Mobile-Doctors] Authenticated via Session:", userId);
        }

        if (!userId) {
            console.warn("[Mobile-Doctors] Unauthorized access attempt");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch all users with DOCTOR role
        const doctors = await prisma.user.findMany({
            where: {
                role: "DOCTOR",
                // isVerified: true, // Show all registered doctors for now
            },
            select: {
                id: true,
                name: true,
                specialization: true,
                avatar: true,
                hospitalClinic: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json({ doctors });
    } catch (error: any) {
        console.error("[Mobile-Doctors] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
