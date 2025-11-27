import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const userId = session.user.id
        const { searchParams } = new URL(req.url)
        const severity = searchParams.get("severity")
        const unacknowledgedOnly = searchParams.get("unacknowledgedOnly") !== "false"

        const where: any = {
            reading: { userId },
        }

        if (unacknowledgedOnly) {
            where.acknowledged = false
        }

        if (severity) {
            where.severity = severity
        }

        const alerts = await prisma.vitalAlert.findMany({
            where,
            include: {
                reading: {
                    select: {
                        id: true,
                        recordedAt: true,
                        systolic: true,
                        diastolic: true,
                        heartRate: true,
                        weight: true,
                        glucose: true,
                        spo2: true,
                        fetalMovement: true,
                    },
                },
            },
            orderBy: [
                { severity: "desc" }, // CRITICAL first
                { createdAt: "desc" },
            ],
        })

        return NextResponse.json({ alerts })
    } catch (error: any) {
        console.error("Error fetching vital alerts:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
