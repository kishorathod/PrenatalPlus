import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const logMedicationSchema = z.object({
    reminderId: z.string().min(1),
    taken: z.boolean(),
    scheduledFor: z.string(), // ISO String
    notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
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
                } catch (e) { }
            }
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = logMedicationSchema.parse(body)

        // Verify reminder belongs to user
        const reminder = await prisma.medicationReminder.findUnique({
            where: { id: validatedData.reminderId }
        })

        if (!reminder || reminder.userId !== userId) {
            return NextResponse.json({ error: "Medication not found" }, { status: 404 })
        }

        const log = await prisma.medicationLog.create({
            data: {
                reminderId: validatedData.reminderId,
                taken: validatedData.taken,
                takenAt: validatedData.taken ? new Date() : null,
                scheduledFor: new Date(validatedData.scheduledFor),
                notes: validatedData.notes,
            }
        })

        return NextResponse.json(log)
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 })
        }
        console.error("Error logging medication:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
