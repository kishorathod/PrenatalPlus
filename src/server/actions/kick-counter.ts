"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

async function checkAuth() {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Unauthorized")
    }
    return session
}

export async function startKickSession(pregnancyId: string) {
    const session = await checkAuth()

    try {
        const pregnancy = await prisma.pregnancy.findFirst({
            where: {
                id: pregnancyId,
                userId: session.user.id!
            }
        })

        if (!pregnancy) {
            return { error: "Pregnancy not found" }
        }

        const kickCount = await prisma.kickCount.create({
            data: {
                userId: session.user.id!,
                pregnancyId,
                count: 0,
                duration: 0,
                week: pregnancy.currentWeek,
                startedAt: new Date()
            }
        })

        return { success: true, sessionId: kickCount.id }
    } catch (error) {
        console.error("Error starting kick session:", error)
        return { error: "Failed to start kick session" }
    }
}

export async function recordKick(sessionId: string) {
    const session = await checkAuth()

    try {
        const kickCount = await prisma.kickCount.findFirst({
            where: {
                id: sessionId,
                userId: session.user.id!,
                completedAt: null
            }
        })

        if (!kickCount) {
            return { error: "Session not found or already completed" }
        }

        const updated = await prisma.kickCount.update({
            where: { id: sessionId },
            data: {
                count: kickCount.count + 1
            }
        })

        return { success: true, count: updated.count }
    } catch (error) {
        console.error("Error recording kick:", error)
        return { error: "Failed to record kick" }
    }
}

export async function endKickSession(sessionId: string, notes?: string) {
    const session = await checkAuth()

    try {
        const kickCount = await prisma.kickCount.findFirst({
            where: {
                id: sessionId,
                userId: session.user.id!
            }
        })

        if (!kickCount) {
            return { error: "Session not found" }
        }

        const duration = Math.floor((new Date().getTime() - kickCount.startedAt.getTime()) / 60000) // minutes

        const updated = await prisma.kickCount.update({
            where: { id: sessionId },
            data: {
                completedAt: new Date(),
                duration,
                notes
            }
        })

        revalidatePath("/patient/kick-counter")
        return { success: true, kickCount: updated }
    } catch (error) {
        console.error("Error ending kick session:", error)
        return { error: "Failed to end kick session" }
    }
}

export async function getKickHistory(pregnancyId: string, limit: number = 30) {
    const session = await checkAuth()

    try {
        const kickCounts = await prisma.kickCount.findMany({
            where: {
                pregnancyId,
                userId: session.user.id!,
                completedAt: { not: null }
            },
            orderBy: { createdAt: "desc" },
            take: limit
        })

        return { kickCounts, error: null }
    } catch (error) {
        console.error("Error fetching kick history:", error)
        return { kickCounts: [], error: "Failed to fetch kick history" }
    }
}

export async function getKickTrends(pregnancyId: string) {
    const session = await checkAuth()

    try {
        // Get last 7 days of completed sessions
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const kickCounts = await prisma.kickCount.findMany({
            where: {
                pregnancyId,
                userId: session.user.id!,
                completedAt: { not: null },
                createdAt: { gte: sevenDaysAgo }
            },
            orderBy: { createdAt: "asc" }
        })

        // Calculate weekly average
        const totalKicks = kickCounts.reduce((sum, kc) => sum + kc.count, 0)
        const averageKicks = kickCounts.length > 0 ? totalKicks / kickCounts.length : 0

        // Check if movement is decreasing (last 2 sessions < average)
        const recentSessions = kickCounts.slice(-2)
        const isDecreasing = recentSessions.length === 2 &&
            recentSessions.every(s => s.count < averageKicks * 0.7)

        return {
            trends: kickCounts.map(kc => ({
                date: kc.createdAt,
                count: kc.count,
                duration: kc.duration
            })),
            averageKicks,
            isDecreasing,
            error: null
        }
    } catch (error) {
        console.error("Error fetching kick trends:", error)
        return { trends: [], averageKicks: 0, isDecreasing: false, error: "Failed to fetch trends" }
    }
}

export async function getActiveKickSession(pregnancyId: string) {
    const session = await checkAuth()

    try {
        const activeSession = await prisma.kickCount.findFirst({
            where: {
                pregnancyId,
                userId: session.user.id!,
                completedAt: null
            },
            orderBy: { startedAt: "desc" }
        })

        return { session: activeSession, error: null }
    } catch (error) {
        console.error("Error fetching active session:", error)
        return { session: null, error: "Failed to fetch active session" }
    }
}
