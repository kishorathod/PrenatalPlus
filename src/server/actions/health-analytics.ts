"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"

export interface VitalsTrend {
    date: string
    systolic?: number
    diastolic?: number
    heartRate?: number
    weight?: number
}

export interface HealthSummary {
    healthScore: number
    latestVitals: {
        bloodPressure?: string
        heartRate?: number
        weight?: number
        lastRecorded?: string
    }
    trends: {
        bloodPressure: "stable" | "rising" | "falling"
        weight: "stable" | "gaining" | "losing"
    }
    alerts: HealthAlert[]
}

export interface HealthAlert {
    id: string
    type: "warning" | "critical"
    message: string
    vital: string
    value: number
    date: string
}

export async function getVitalsHistory(days: number = 30) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const vitals = await prisma.vitalReading.findMany({
            where: {
                userId: session.user.id,
                createdAt: { gte: startDate }
            },
            orderBy: { createdAt: 'asc' }
        })

        return { vitals }
    } catch (error) {
        console.error("Error fetching vitals history:", error)
        return { error: "Failed to fetch vitals history" }
    }
}

export async function getVitalsTrends(days: number = 30): Promise<{ trends?: VitalsTrend[], error?: string }> {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const readings = await prisma.vitalReading.findMany({
            where: {
                userId: session.user.id,
                createdAt: { gte: startDate }
            },
            orderBy: { createdAt: 'asc' }
        })

        // Group by date and calculate daily averages
        const dailyData: Record<string, { systolic: number[], diastolic: number[], heartRate: number[], weight: number[] }> = {}

        readings.forEach((reading) => {
            const dateKey = new Date(reading.createdAt).toISOString().split('T')[0]
            if (!dailyData[dateKey]) {
                dailyData[dateKey] = { systolic: [], diastolic: [], heartRate: [], weight: [] }
            }
            if (reading.systolic) dailyData[dateKey].systolic.push(reading.systolic)
            if (reading.diastolic) dailyData[dateKey].diastolic.push(reading.diastolic)
            if (reading.heartRate) dailyData[dateKey].heartRate.push(reading.heartRate)
            if (reading.weight) dailyData[dateKey].weight.push(reading.weight)
        })

        const trends: VitalsTrend[] = Object.entries(dailyData).map(([date, data]) => ({
            date,
            systolic: data.systolic.length > 0 ? Math.round(data.systolic.reduce((a, b) => a + b) / data.systolic.length) : undefined,
            diastolic: data.diastolic.length > 0 ? Math.round(data.diastolic.reduce((a, b) => a + b) / data.diastolic.length) : undefined,
            heartRate: data.heartRate.length > 0 ? Math.round(data.heartRate.reduce((a, b) => a + b) / data.heartRate.length) : undefined,
            weight: data.weight.length > 0 ? Math.round(data.weight.reduce((a, b) => a + b) / data.weight.length * 10) / 10 : undefined,
        }))

        return { trends }
    } catch (error) {
        console.error("Error fetching vitals trends:", error)
        return { error: "Failed to fetch trends" }
    }
}

export async function getHealthSummary(): Promise<{ summary?: HealthSummary, error?: string }> {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        // Get latest reading
        const latestReading = await prisma.vitalReading.findFirst({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        })

        // Get readings from last 7 days for trend analysis
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)

        const recentReadings = await prisma.vitalReading.findMany({
            where: {
                userId: session.user.id,
                createdAt: { gte: weekAgo }
            },
            orderBy: { createdAt: 'asc' }
        })

        // Calculate health score (simplified)
        let healthScore = 85 // Base score
        const alerts: HealthAlert[] = []

        if (latestReading) {
            // Check blood pressure
            if (latestReading.systolic && latestReading.systolic > 140) {
                healthScore -= 15
                const alert = {
                    id: `bp-high-${Date.now()}`,
                    type: latestReading.systolic > 160 ? "critical" : "warning",
                    message: "Blood pressure is elevated",
                    vital: "Blood Pressure",
                    value: latestReading.systolic,
                    date: latestReading.createdAt.toISOString()
                } as HealthAlert
                alerts.push(alert)

                // Send notification for critical BP
                if (latestReading.systolic > 140) {
                    const { sendHealthAlert } = await import("./notifications")
                    await sendHealthAlert(
                        session.user.id,
                        `Your blood pressure is ${latestReading.systolic > 160 ? 'critically' : ''} elevated (${latestReading.systolic}/${latestReading.diastolic}). Please consult your doctor.`,
                        "Blood Pressure"
                    )
                }
            }

            // Check heart rate
            if (latestReading.heartRate && (latestReading.heartRate > 100 || latestReading.heartRate < 60)) {
                healthScore -= 10
                alerts.push({
                    id: `hr-${Date.now()}`,
                    type: "warning",
                    message: latestReading.heartRate > 100 ? "Heart rate is elevated" : "Heart rate is low",
                    vital: "Heart Rate",
                    value: latestReading.heartRate,
                    date: latestReading.createdAt.toISOString()
                })

                // Send notification for abnormal heart rate
                const { sendHealthAlert } = await import("./notifications")
                await sendHealthAlert(
                    session.user.id,
                    `Your heart rate is ${latestReading.heartRate > 100 ? 'elevated' : 'low'} (${latestReading.heartRate} bpm). Please monitor closely.`,
                    "Heart Rate"
                )
            }
        }

        // Determine trends
        let bpTrend: "stable" | "rising" | "falling" = "stable"
        let weightTrend: "stable" | "gaining" | "losing" = "stable"

        if (recentReadings.length >= 2) {
            const firstReading = recentReadings[0]
            const lastReading = recentReadings[recentReadings.length - 1]

            if (firstReading.systolic && lastReading.systolic) {
                const bpDiff = lastReading.systolic - firstReading.systolic
                if (bpDiff > 5) bpTrend = "rising"
                else if (bpDiff < -5) bpTrend = "falling"
            }

            if (firstReading.weight && lastReading.weight) {
                const weightDiff = lastReading.weight - firstReading.weight
                if (weightDiff > 0.5) weightTrend = "gaining"
                else if (weightDiff < -0.5) weightTrend = "losing"
            }
        }

        const summary: HealthSummary = {
            healthScore: Math.max(0, Math.min(100, healthScore)),
            latestVitals: {
                bloodPressure: latestReading?.systolic && latestReading?.diastolic
                    ? `${latestReading.systolic}/${latestReading.diastolic}`
                    : undefined,
                heartRate: latestReading?.heartRate || undefined,
                weight: latestReading?.weight || undefined,
                lastRecorded: latestReading?.createdAt.toISOString()
            },
            trends: {
                bloodPressure: bpTrend,
                weight: weightTrend
            },
            alerts
        }

        return { summary }
    } catch (error) {
        console.error("Error fetching health summary:", error)
        return { error: "Failed to fetch health summary" }
    }
}
