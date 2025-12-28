import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/server/auth";
import { weeklyPregnancyData, getWeekInfo } from "@/lib/pregnancy-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        // Try standard NextAuth session first
        const session = await auth();
        let userId = session?.user?.id;
        let authMethod = "session";

        const authHeader = req.headers.get("authorization");

        if (!userId) {
            // Fallback to manual Bearer token for mobile
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                console.log("[Mobile-Dashboard] Unauthorized: No session and no Bearer token");
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const token = authHeader.substring(7);
            try {
                const decoded = Buffer.from(token, 'base64').toString('utf-8');
                const userData = JSON.parse(decoded);
                userId = userData.userId || userData.id; // Support both naming variants
                authMethod = "token";
                console.log("[Mobile-Dashboard] Decoded user from token:", userId);
            } catch (e) {
                console.error("[Mobile-Dashboard] Token decode error:", e);
                return NextResponse.json({ error: "Invalid token" }, { status: 401 });
            }
        }

        if (!userId) {
            return NextResponse.json({ error: "User ID not found" }, { status: 401 });
        }
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
            recentNotifications,
        ] = await Promise.all([
            // Total appointments
            prisma.appointment.count({
                where: { userId },
            }),
            // Upcoming appointments
            prisma.appointment.count({
                where: {
                    userId,
                    date: {
                        gte: now,
                    },
                    status: {
                        in: ["SCHEDULED", "CONFIRMED"],
                    },
                },
            }),
            // Total vitals
            prisma.vitalReading.count({
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
            // Recent notifications (last 5)
            prisma.notification.findMany({
                where: { userId },
                take: 5,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    message: true,
                    type: true,
                    priority: true,
                    read: true,
                    createdAt: true,
                },
            }),
        ]);

        // Determine Health Tip
        let healthTip = {
            title: "Daily Health Tip",
            message: "Stay hydrated! Drinking enough water helps maintain amniotic fluid levels. 👶"
        };

        if (activePregnancy) {
            const weekInfo = getWeekInfo(activePregnancy.currentWeek);
            if (weekInfo && weekInfo.tips.length > 0) {
                // Pick a tip - for simplicity, use the first one or rotate based on day
                const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
                const tipIndex = dayOfYear % weekInfo.tips.length;
                healthTip = {
                    title: `Week ${activePregnancy.currentWeek} Tip`,
                    message: weekInfo.tips[tipIndex]
                };
            }
        }

        return NextResponse.json({
            stats: {
                totalAppointments,
                upcomingAppointments,
                totalVitals,
                totalReports,
                hasActivePregnancy: !!activePregnancy,
            },
            pregnancy: activePregnancy,
            healthTip,
            recent: {
                appointments: recentAppointments,
                vitals: recentVitals,
                notifications: recentNotifications,
            },
        });
    } catch (error: any) {
        console.error("[Mobile-Dashboard] Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
