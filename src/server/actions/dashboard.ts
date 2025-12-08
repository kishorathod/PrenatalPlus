"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPatientDashboardStats() {
    try {
        const session = await auth()
        if (!session?.user) {
            return {
                stats: { upcomingAppointments: 0, totalVitals: 0, totalReports: 0, activePregnancies: 0 },
                pregnancy: null,
                recentActivity: [],
                vitalsHistory: [],
                error: null
            }
        }

        const userId = session.user.id

        // 1. Get counts
        const upcomingAppointmentsCount = await prisma.appointment.count({
            where: { userId, date: { gte: new Date() } }
        })

        const totalVitals = await prisma.vitalReading.count({
            where: { userId }
        })

        // Mocking reports count for now as the model might not be fully set up or populated
        // In a real scenario: await prisma.medicalReport.count({ where: { userId } })
        const totalReports = 0

        // 2. Get active pregnancy
        const activePregnancy = await prisma.pregnancy.findFirst({
            where: { userId, status: "ACTIVE" },
            orderBy: { createdAt: "desc" }
        })

        // 3. Get recent activity (Appointments + Vitals)
        const recentAppointments = await prisma.appointment.findMany({
            where: { userId },
            orderBy: { date: "desc" },
            take: 5,
            include: { doctor: { select: { name: true } } }
        })

        const recentVitals = await prisma.vitalReading.findMany({
            where: { userId },
            orderBy: { recordedAt: "desc" },
            take: 5
        })

        // Combine and sort activity
        const activity = [
            ...recentAppointments.map(a => ({ type: 'APPOINTMENT', date: a.date, data: a })),
            ...recentVitals.map(v => ({ type: 'VITALS', date: v.recordedAt, data: v }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

        // 4. Get vitals history for charts (last 10 readings)
        const vitalsHistory = await prisma.vitalReading.findMany({
            where: { userId },
            orderBy: { recordedAt: "asc" }, // Ascending for charts
            take: 10,
            select: {
                recordedAt: true,
                weight: true,
                systolic: true,
                diastolic: true
            }
        })

        return {
            stats: {
                upcomingAppointments: upcomingAppointmentsCount,
                totalVitals,
                totalReports,
                activePregnancies: activePregnancy ? 1 : 0
            },
            pregnancy: activePregnancy,
            recentActivity: activity,
            vitalsHistory,
            error: null
        }

    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return {
            stats: { upcomingAppointments: 0, totalVitals: 0, totalReports: 0, activePregnancies: 0 },
            pregnancy: null,
            recentActivity: [],
            vitalsHistory: [],
            error: null
        }
    }
}

export async function refreshDashboard() {
    "use server"
    revalidatePath("/patient/dashboard")
    revalidatePath("/dashboard")
}
