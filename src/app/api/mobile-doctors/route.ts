import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/server/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        // Auth check (standard for our mobile APIs)
        const authHeader = req.headers.get("authorization");
        const session = await auth();
        let userId = session?.user?.id;

        if (!userId && authHeader?.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            try {
                const decoded = Buffer.from(token, 'base64').toString('utf-8');
                const userData = JSON.parse(decoded);
                userId = userData.userId || userData.id;
            } catch (e) {
                return NextResponse.json({ error: "Invalid token" }, { status: 401 });
            }
        }

        if (!userId) {
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
