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
                recentActivity: { appointments: [], vitals: [] },
                error: null
            }
        }

        const userId = session.user.id

        // Get appointment counts
        const upcomingAppointments = await prisma.appointment.count({
            where: {
                userId,
                date: { gte: new Date() }
            }
        })

        // Get active pregnancies count
        const activePregnancies = await prisma.pregnancy.count({
            where: {
                userId,
                status: "ACTIVE"
            }
        })

        // Get recent appointments
        const recentAppointments = await prisma.appointment.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 3,
            select: {
                id: true,
                title: true,
                date: true,
                status: true,
                type: true
            }
        })

        return {
            stats: {
                upcomingAppointments,
                totalVitals: 0, // Will be enabled after Prisma regeneration
                totalReports: 0,
                activePregnancies
            },
            recentActivity: {
                appointments: recentAppointments,
                vitals: [] // Will be enabled after Prisma regeneration
            },
            error: null
        }

    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return {
            stats: { upcomingAppointments: 0, totalVitals: 0, totalReports: 0, activePregnancies: 0 },
            recentActivity: { appointments: [], vitals: [] },
            error: null
        }
    }
}

export async function refreshDashboard() {
    "use server"
    revalidatePath("/patient/dashboard")
    revalidatePath("/dashboard")
}
