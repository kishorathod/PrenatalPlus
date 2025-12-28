import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const dynamic = "force-dynamic"

const createMedicationSchema = z.object({
    name: z.string().min(1),
    dosage: z.string().min(1),
    frequency: z.enum(["DAILY", "TWICE_DAILY", "THREE_TIMES_DAILY", "WEEKLY", "AS_NEEDED"]),
    timeOfDay: z.array(z.string()),
    startDate: z.string().optional(),
})

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        let userId = session?.user?.id

        // Fallback for mobile auth
        if (!userId) {
            const authHeader = req.headers.get("authorization")
            if (authHeader?.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1]
                try {
                    const decoded = JSON.parse(Buffer.from(token, "base64").toString())
                    userId = decoded.userId
                } catch (e) {
                    console.error("[Medications] Auth fallback error:", e)
                }
            }
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)

        const todayEnd = new Date()
        todayEnd.setHours(23, 59, 59, 999)

        const medications = await prisma.medicationReminder.findMany({
            where: {
                userId,
                isActive: true,
            },
            include: {
                logs: {
                    where: {
                        scheduledFor: {
                            gte: todayStart,
                            lte: todayEnd,
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json({ medications })
    } catch (error) {
        console.error("Error fetching medications:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization")
        let userId: string | undefined

        // 1. Prioritize Bearer token for Mobile requests
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.substring(7)
            try {
                const decoded = JSON.parse(Buffer.from(token, "base64").toString())
                userId = decoded.userId
                console.log("[Medications-POST] Using Bearer token for user:", userId);
            } catch (e) {
                console.error("[Medications-POST] Auth fallback error:", e)
            }
        }

        // 2. Fallback to standard NextAuth session
        if (!userId) {
            const session = await auth()
            userId = session?.user?.id
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        console.log("[Medications-POST] Attempting to create for userId:", userId);

        const body = await req.json()
        const validatedData = createMedicationSchema.parse(body)

        const medication = await prisma.medicationReminder.create({
            data: {
                userId,
                name: validatedData.name,
                dosage: validatedData.dosage,
                frequency: validatedData.frequency,
                timeOfDay: validatedData.timeOfDay,
                startDate: validatedData.startDate ? new Date(validatedData.startDate) : new Date(),
            }
        })

        return NextResponse.json(medication)
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 })
        }
        console.error("Error creating medication:", error)
        return NextResponse.json({
            error: "Internal server error",
            details: error.message,
            code: error.code
        }, { status: 500 })
    }
}
