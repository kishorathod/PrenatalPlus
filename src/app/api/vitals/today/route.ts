import { NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Get today's vitals
        const [bpSystolic, bpDiastolic, weight, heartRate] = await Promise.all([
            prisma.vitalSign.findFirst({
                where: {
                    userId: session.user.id!,
                    type: "BLOOD_PRESSURE_SYSTOLIC",
                    recordedAt: { gte: today }
                },
                orderBy: { recordedAt: "desc" }
            }),
            prisma.vitalSign.findFirst({
                where: {
                    userId: session.user.id!,
                    type: "BLOOD_PRESSURE_DIASTOLIC",
                    recordedAt: { gte: today }
                },
                orderBy: { recordedAt: "desc" }
            }),
            prisma.vitalSign.findFirst({
                where: {
                    userId: session.user.id!,
                    type: "WEIGHT",
                    recordedAt: { gte: today }
                },
                orderBy: { recordedAt: "desc" }
            }),
            prisma.vitalSign.findFirst({
                where: {
                    userId: session.user.id!,
                    type: "HEART_RATE",
                    recordedAt: { gte: today }
                },
                orderBy: { recordedAt: "desc" }
            }),
        ])

        // Get last week's weight for comparison
        const lastWeek = new Date()
        lastWeek.setDate(lastWeek.getDate() - 7)
        const lastWeekWeight = await prisma.vitalSign.findFirst({
            where: {
                userId: session.user.id!,
                type: "WEIGHT",
                recordedAt: { lte: lastWeek }
            },
            orderBy: { recordedAt: "desc" }
        })

        return NextResponse.json({
            bp: bpSystolic && bpDiastolic ? {
                systolic: bpSystolic.value,
                diastolic: bpDiastolic.value,
            } : null,
            weight: weight ? {
                value: weight.value,
                change: lastWeekWeight ? weight.value - lastWeekWeight.value : null
            } : null,
            heartRate: heartRate ? {
                value: heartRate.value,
                status: heartRate.value > 100 ? "Elevated" : heartRate.value < 60 ? "Low" : "Normal"
            } : null
        })
    } catch (error) {
        console.error("Error fetching today's vitals:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
