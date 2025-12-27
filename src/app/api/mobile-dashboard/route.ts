import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        // Extract and decode Bearer token
        const authHeader = req.headers.get("authorization");

        console.log("[Mobile-Dashboard] Auth header:", authHeader ? "Present" : "Missing");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("[Mobile-Dashboard] Unauthorized: No Bearer token");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.substring(7);
        console.log("[Mobile-Dashboard] Token length:", token.length);

        let userData;
        try {
            const decoded = Buffer.from(token, 'base64').toString('utf-8');
            userData = JSON.parse(decoded);
            console.log("[Mobile-Dashboard] Decoded user:", userData.userId, userData.email);
        } catch (e) {
            console.error("[Mobile-Dashboard] Token decode error:", e);
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const userId = userData.userId;
        const now = new Date();

        // Fetch dashboard statistics
        const [
            totalAppointments,
            upcomingAppointments,
            totalVitals,
            totalReports,
            activePregnancy,
            recentAppointments,
            recentVitals,
        ] = await Promise.all([
            // Total appointments
            prisma.appointment.count({
                where: { userId },
            }),
            // Upcoming appointments (next 7 days)
            prisma.appointment.count({
                where: {
                    userId,
                    date: {
                        gte: now,
                        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                    status: {
                        in: ["SCHEDULED", "CONFIRMED"],
                    },
                },
            }),
            // Total vitals
            prisma.vitalSign.count({
                where: { userId },
            }),
            // Total reports
            prisma.medicalReport.count({
                where: { userId },
            }),
            // Active pregnancy
            prisma.pregnancy.findFirst({
                where: {
                    userId,
                    status: "ACTIVE",
                },
                select: {
                    id: true,
                    currentWeek: true,
                    dueDate: true,
                    startDate: true,
                    riskLevel: true,
                },
            }),
            // Recent appointments (last 5)
            prisma.appointment.findMany({
                where: { userId },
                take: 5,
                orderBy: { date: "desc" },
                select: {
                    id: true,
                    title: true,
                    date: true,
                    status: true,
                    type: true,
                    doctorName: true,
                },
            }),
            // Recent vitals (last 5)
            prisma.vitalReading.findMany({
                where: { userId },
                take: 5,
                orderBy: { recordedAt: "desc" },
                select: {
                    id: true,
                    systolic: true,
                    diastolic: true,
                    heartRate: true,
                    weight: true,
                    recordedAt: true,
                },
            }),
        ]);

        return NextResponse.json({
            stats: {
                totalAppointments,
                upcomingAppointments,
                totalVitals,
                totalReports,
                hasActivePregnancy: !!activePregnancy,
            },
            pregnancy: activePregnancy,
            recent: {
                appointments: recentAppointments,
                vitals: recentVitals,
            },
        });
    } catch (error: any) {
        console.error("[Mobile-Dashboard] Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
