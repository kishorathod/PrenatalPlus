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

        // Calculate health score dynamically
        let healthScore = 0
        const alerts: HealthAlert[] = []

        // 1. Blood Pressure Score (30 points)
        if (latestReading?.systolic && latestReading?.diastolic) {
            const sys = latestReading.systolic
            const dia = latestReading.diastolic

            if (sys >= 110 && sys <= 120 && dia >= 70 && dia <= 80) {
                healthScore += 30 // Optimal
            } else if (sys >= 110 && sys <= 130 && dia >= 70 && dia <= 85) {
                healthScore += 26 // Normal
            } else if (sys >= 130 && sys <= 140 || dia >= 85 && dia <= 90) {
                healthScore += 18 // Elevated
                alerts.push({
                    id: `bp-elevated-${Date.now()}`,
                    type: "warning",
                    message: "Blood pressure is slightly elevated",
                    vital: "Blood Pressure",
                    value: sys,
                    date: latestReading.createdAt.toISOString()
                })
            } else if (sys > 140 || dia > 90) {
                healthScore += sys > 160 ? 5 : 10 // High/Critical
                alerts.push({
                    id: `bp-high-${Date.now()}`,
                    type: sys > 160 ? "critical" : "warning",
                    message: "Blood pressure is elevated",
                    vital: "Blood Pressure",
                    value: sys,
                    date: latestReading.createdAt.toISOString()
                })

                if (sys > 140) {
                    const { sendHealthAlert } = await import("./notifications")
                    await sendHealthAlert(
                        session.user.id,
                        `Your blood pressure is ${sys > 160 ? 'critically' : ''} elevated (${sys}/${dia}). Please consult your doctor.`,
                        "Blood Pressure"
                    )
                }
            } else {
                healthScore += 15 // Below normal
            }
        } else {
            healthScore += 15 // No data, neutral score
        }

        // 2. Heart Rate Score (25 points)
        if (latestReading?.heartRate) {
            const hr = latestReading.heartRate

            if (hr >= 60 && hr <= 100) {
                healthScore += 25 // Normal
            } else if ((hr >= 55 && hr < 60) || (hr > 100 && hr <= 110)) {
                healthScore += 18 // Slightly abnormal
            } else {
                healthScore += 8 // Very abnormal
                alerts.push({
                    id: `hr-${Date.now()}`,
                    type: "warning",
                    message: hr > 100 ? "Heart rate is elevated" : "Heart rate is low",
                    vital: "Heart Rate",
                    value: hr,
                    date: latestReading.createdAt.toISOString()
                })

                const { sendHealthAlert } = await import("./notifications")
                await sendHealthAlert(
                    session.user.id,
                    `Your heart rate is ${hr > 100 ? 'elevated' : 'low'} (${hr} bpm). Please monitor closely.`,
                    "Heart Rate"
                )
            }
        } else {
            healthScore += 12 // No data, neutral score
        }

        // 3. Weight Trend Score (20 points)
        if (recentReadings.length >= 2) {
            const firstReading = recentReadings[0]
            const lastReading = recentReadings[recentReadings.length - 1]

            if (firstReading.weight && lastReading.weight) {
                const weightDiff = lastReading.weight - firstReading.weight
                const daysSpan = Math.max(1, (lastReading.createdAt.getTime() - firstReading.createdAt.getTime()) / (1000 * 60 * 60 * 24))
                const weeklyChange = (weightDiff / daysSpan) * 7

                if (weeklyChange >= 0.3 && weeklyChange <= 1.0) {
                    healthScore += 20 // Healthy gain
                } else if (Math.abs(weeklyChange) <= 0.3) {
                    healthScore += 16 // Stable
                } else {
                    healthScore += 10 // Rapid change
                }
            } else {
                healthScore += 10
            }
        } else {
            healthScore += 10 // Not enough data
        }

        // 4. Recording Consistency Score (15 points)
        const last7Days = new Date()
        last7Days.setDate(last7Days.getDate() - 7)
        const recordingsLast7Days = await prisma.vitalReading.count({
            where: {
                userId: session.user.id,
                createdAt: { gte: last7Days }
            }
        })

        if (recordingsLast7Days >= 5) {
            healthScore += 15 // Regular tracking
        } else if (recordingsLast7Days >= 2) {
            healthScore += 10 // Occasional tracking
        } else {
            healthScore += 5 // Rare tracking
        }

        // 5. No Critical Alerts Bonus (10 points)
        const criticalAlerts = alerts.filter(a => a.type === "critical")
        if (criticalAlerts.length === 0) {
            healthScore += 10
        } else if (alerts.filter(a => a.type === "warning").length === 0) {
            healthScore += 5
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
