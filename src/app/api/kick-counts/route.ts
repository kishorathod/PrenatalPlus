import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { createKickCountSchema } from "@/lib/validations/kick-count.validation"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const validatedData = createKickCountSchema.parse(body)

        const userId = session.user.id

        // Create the kick count entry
        const kickCount = await prisma.kickCount.create({
            data: {
                userId,
                pregnancyId: validatedData.pregnancyId,
                count: validatedData.count,
                duration: validatedData.duration,
                week: validatedData.week,
                notes: validatedData.notes,
                startedAt: validatedData.startedAt,
                completedAt: validatedData.completedAt || new Date(),
            }
        })

        return NextResponse.json(kickCount, { status: 201 })
    } catch (error: any) {
        console.error("Error creating kick count:", error)

        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Invalid input", details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

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
        const pregnancyId = searchParams.get("pregnancyId")
        const limit = parseInt(searchParams.get("limit") || "50")

        const where: any = { userId }
        if (pregnancyId) {
            where.pregnancyId = pregnancyId
        }

        const kickCounts = await prisma.kickCount.findMany({
            where,
            orderBy: { startedAt: "desc" },
            take: limit,
        })

        // Calculate statistics for the mobile app
        const stats = {
            totalSessions: kickCounts.length,
            totalKicks: kickCounts.reduce((sum, k) => sum + k.count, 0),
            averageDuration: kickCounts.length > 0
                ? kickCounts.reduce((sum, k) => sum + k.duration, 0) / kickCounts.length
                : 0,
            lastSession: kickCounts[0] || null,
        }

        return NextResponse.json({
            kickCounts,
            stats,
        })
    } catch (error: any) {
        console.error("Error fetching kick counts:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
