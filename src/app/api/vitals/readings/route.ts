import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { createVitalReadingSchema } from "@/lib/validations/vital-reading.validation"
import { generateAlertsFromReading } from "@/lib/utils/vital-alerts"

export async function POST(req: NextRequest) {
    try {
        console.log("[Vitals-POST] Checking authentication...");
        const session = await auth()
        let userId = session?.user?.id

        if (!userId) {
            const authHeader = req.headers.get("authorization")
            if (authHeader?.startsWith("Bearer ")) {
                const token = authHeader.substring(7)
                try {
                    const decoded = Buffer.from(token, 'base64').toString('utf-8')
                    const userData = JSON.parse(decoded)
                    userId = userData.userId || userData.id
                    console.log("[Vitals-POST] Authenticated via Bearer token:", userId);
                } catch (e) {
                    console.error("[Vitals-POST] Token decode error:", e);
                }
            }
        } else {
            console.log("[Vitals-POST] Authenticated via Session:", userId);
        }

        if (!userId) {
            console.warn("[Vitals-POST] Unauthorized access attempt");
            return NextResponse.json({ error: "Unauthorized: No valid session or token found" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: userId as string },
            select: { id: true }
        })

        if (!user) {
            console.warn(`[Vitals-POST] User not found in DB: ${userId}`);
            return NextResponse.json({ error: "User not found. Please log in again." }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = createVitalReadingSchema.parse(body)

        // Get the most recent reading for weight gain comparison
        const previousReading = validatedData.weight
            ? await prisma.vitalReading.findFirst({
                where: { userId: userId as string, weight: { not: null } },
                orderBy: { recordedAt: "desc" },
                select: { weight: true, recordedAt: true },
            })
            : null

        // Generate alerts based on the reading
        const alertsData = generateAlertsFromReading(
            validatedData,
            previousReading || undefined,
            validatedData.recordedAt || new Date()
        )

        // Create the vital reading with alerts
        const vitalReading = await prisma.vitalReading.create({
            data: {
                userId: userId as string,
                pregnancyId: validatedData.pregnancyId,
                systolic: validatedData.systolic,
                diastolic: validatedData.diastolic,
                heartRate: validatedData.heartRate,
                weight: validatedData.weight,
                temperature: validatedData.temperature,
                glucose: validatedData.glucose,
                spo2: validatedData.spo2,
                fetalMovement: validatedData.fetalMovement,
                week: validatedData.week,
                notes: validatedData.notes,
                recordedAt: validatedData.recordedAt || new Date(),
                hasAlerts: alertsData.length > 0,
                alerts: {
                    create: alertsData,
                },
            },
            include: {
                alerts: true,
            },
        })

        return NextResponse.json(vitalReading, { status: 201 })
    } catch (error: any) {
        console.error("[Vitals-POST] Error:", error)

        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Invalid input", details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Internal server error", message: error.message },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    try {
        console.log("[Vitals-GET] Checking authentication...");
        const session = await auth()
        let userId = session?.user?.id

        if (!userId) {
            const authHeader = req.headers.get("authorization")
            if (authHeader?.startsWith("Bearer ")) {
                const token = authHeader.substring(7)
                try {
                    const decoded = Buffer.from(token, 'base64').toString('utf-8')
                    const userData = JSON.parse(decoded)
                    userId = userData.userId || userData.id
                    console.log("[Vitals-GET] Authenticated via Bearer token:", userId);
                } catch (e) {
                    console.error("[Vitals-GET] Token decode error:", e)
                }
            }
        } else {
            console.log("[Vitals-GET] Authenticated via Session:", userId);
        }

        if (!userId) {
            console.warn("[Vitals-GET] Unauthorized access attempt");
            return NextResponse.json({ error: "Unauthorized: No valid session or token found" }, { status: 401 })
        }

        // Verify user exists in DB to prevent stale session issues
        const user = await prisma.user.findUnique({
            where: { id: userId as string },
            select: { id: true }
        })

        if (!user) {
            console.warn(`[Vitals-GET] User not found in DB: ${userId}`);
            return NextResponse.json({ error: "User not found. Please log in again." }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const pregnancyId = searchParams.get("pregnancyId")
        const limit = parseInt(searchParams.get("limit") || "50")
        const includeAlerts = searchParams.get("includeAlerts") !== "false"

        const where: any = { userId: userId as string }
        if (pregnancyId) {
            where.pregnancyId = pregnancyId
        }

        const readings = await prisma.vitalReading.findMany({
            where,
            include: includeAlerts ? { alerts: true } : undefined,
            orderBy: { recordedAt: "desc" },
            take: limit,
        })

        // Calculate statistics
        const stats = {
            totalReadings: readings.length,
            activeAlerts: readings.reduce((sum, r) => sum + ((r as any).alerts?.filter((a: any) => !a.acknowledged).length || 0), 0),
            averageSystolic: readings.filter(r => r.systolic).length > 0
                ? readings.reduce((sum, r) => sum + (r.systolic || 0), 0) / readings.filter(r => r.systolic).length
                : null,
            averageDiastolic: readings.filter(r => r.diastolic).length > 0
                ? readings.reduce((sum, r) => sum + (r.diastolic || 0), 0) / readings.filter(r => r.diastolic).length
                : null,
            averageHeartRate: readings.filter(r => r.heartRate).length > 0
                ? readings.reduce((sum, r) => sum + (r.heartRate || 0), 0) / readings.filter(r => r.heartRate).length
                : null,
            currentWeight: readings.find(r => r.weight)?.weight || null,
            lastReading: readings[0] || null,
        }

        return NextResponse.json({
            readings,
            stats,
        })
    } catch (error: any) {
        console.error("[Vitals-GET] Error:", error)
        return NextResponse.json(
            { error: "Internal server error", message: error.message },
            { status: 500 }
        )
    }
}
