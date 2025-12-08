"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notifications"

async function checkAuth() {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Unauthorized")
    }
    return session
}

export async function startContractionSession(pregnancyId: string) {
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

        const contractionSession = await prisma.contractionSession.create({
            data: {
                userId: session.user.id!,
                pregnancyId,
                startedAt: new Date()
            }
        })

        return { success: true, sessionId: contractionSession.id }
    } catch (error) {
        console.error("Error starting contraction session:", error)
        return { error: "Failed to start session" }
    }
}

export async function recordContraction(
    sessionId: string,
    duration: number,
    intensity: "MILD" | "MODERATE" | "STRONG",
    notes?: string
) {
    const session = await checkAuth()

    try {
        const contractionSession = await prisma.contractionSession.findFirst({
            where: {
                id: sessionId,
                userId: session.user.id!,
                endedAt: null
            }
        })

        if (!contractionSession) {
            return { error: "Session not found or already ended" }
        }

        const contraction = await prisma.contraction.create({
            data: {
                userId: session.user.id!,
                pregnancyId: contractionSession.pregnancyId,
                sessionId,
                duration,
                intensity,
                notes,
                startTime: new Date()
            }
        })

        // Check for labor pattern
        const recentContractions = await prisma.contraction.findMany({
            where: {
                sessionId,
                startTime: {
                    gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
                }
            },
            orderBy: { startTime: "asc" }
        })

        const pattern = analyzeContractionPattern(recentContractions)

        return { success: true, contraction, pattern }
    } catch (error) {
        console.error("Error recording contraction:", error)
        return { error: "Failed to record contraction" }
    }
}

export async function endContractionSession(sessionId: string) {
    const session = await checkAuth()

    try {
        const contractionSession = await prisma.contractionSession.findFirst({
            where: {
                id: sessionId,
                userId: session.user.id!
            },
            include: {
                contractions: true
            }
        })

        if (!contractionSession) {
            return { error: "Session not found" }
        }

        const updated = await prisma.contractionSession.update({
            where: { id: sessionId },
            data: {
                endedAt: new Date()
            }
        })

        revalidatePath("/patient/contraction-timer")
        return { success: true, session: updated }
    } catch (error) {
        console.error("Error ending session:", error)
        return { error: "Failed to end session" }
    }
}

export async function getActiveSession(pregnancyId: string) {
    const session = await checkAuth()

    try {
        const activeSession = await prisma.contractionSession.findFirst({
            where: {
                pregnancyId,
                userId: session.user.id!,
                endedAt: null
            },
            include: {
                contractions: {
                    orderBy: { startTime: "desc" }
                }
            }
        })

        return { session: activeSession, error: null }
    } catch (error) {
        console.error("Error fetching active session:", error)
        return { session: null, error: "Failed to fetch session" }
    }
}

export async function getContractionHistory(pregnancyId: string, limit: number = 10) {
    const session = await checkAuth()

    try {
        const sessions = await prisma.contractionSession.findMany({
            where: {
                pregnancyId,
                userId: session.user.id!,
                endedAt: { not: null }
            },
            include: {
                contractions: true
            },
            orderBy: { startedAt: "desc" },
            take: limit
        })

        return { sessions, error: null }
    } catch (error) {
        console.error("Error fetching history:", error)
        return { sessions: [], error: "Failed to fetch history" }
    }
}

// Pattern Analysis
function analyzeContractionPattern(contractions: any[]) {
    if (contractions.length < 3) {
        return {
            status: "monitoring",
            message: "Keep tracking contractions",
            shouldAlert: false
        }
    }

    // Calculate average frequency (time between contractions)
    const intervals = []
    for (let i = 1; i < contractions.length; i++) {
        const interval = (new Date(contractions[i].startTime).getTime() -
            new Date(contractions[i - 1].startTime).getTime()) / 60000 // minutes
        intervals.push(interval)
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const avgDuration = contractions.reduce((sum, c) => sum + c.duration, 0) / contractions.length

    // Labor pattern detection
    // Active labor: contractions 3-5 minutes apart, lasting 45-60 seconds
    if (avgInterval <= 5 && avgDuration >= 45 && contractions.length >= 5) {
        return {
            status: "active_labor",
            message: "⚠️ ACTIVE LABOR PATTERN DETECTED! Contractions are regular and strong. It's time to go to the hospital!",
            shouldAlert: true,
            avgInterval: Math.round(avgInterval),
            avgDuration: Math.round(avgDuration)
        }
    }

    // Early labor: contractions 5-20 minutes apart
    if (avgInterval <= 20 && avgInterval > 5 && contractions.length >= 4) {
        return {
            status: "early_labor",
            message: "Early labor pattern detected. Continue monitoring and prepare to go to hospital.",
            shouldAlert: true,
            avgInterval: Math.round(avgInterval),
            avgDuration: Math.round(avgDuration)
        }
    }

    return {
        status: "monitoring",
        message: "Continue tracking. Pattern not yet established.",
        shouldAlert: false,
        avgInterval: Math.round(avgInterval),
        avgDuration: Math.round(avgDuration)
    }
}

export async function deleteContraction(contractionId: string) {
    const session = await checkAuth()

    try {
        await prisma.contraction.delete({
            where: {
                id: contractionId,
                userId: session.user.id!
            }
        })

        revalidatePath("/patient/contraction-timer")
        return { success: true }
    } catch (error) {
        console.error("Error deleting contraction:", error)
        return { error: "Failed to delete contraction" }
    }
}
