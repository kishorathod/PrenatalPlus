import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { weeklyPregnancyData, getWeekInfo } from "@/lib/pregnancy-data"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        let userId = session?.user?.id

        // Fallback for mobile auth if session doesn't exist
        if (!userId) {
            const authHeader = req.headers.get("authorization")
            if (authHeader?.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1]
                try {
                    const decoded = JSON.parse(Buffer.from(token, "base64").toString())
                    userId = decoded.userId
                } catch (e) {
                    console.error("Failed to decode token", e)
                }
            }
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const weekParam = searchParams.get("week")

        let targetWeek: number

        if (weekParam) {
            targetWeek = parseInt(weekParam)
        } else {
            // Get current week from active pregnancy if no week param
            const activePregnancy = await prisma.pregnancy.findFirst({
                where: { userId, status: "ACTIVE" },
                orderBy: { startDate: "desc" },
            })

            if (!activePregnancy) {
                // Default to week 4 (earliest data) if no active pregnancy
                targetWeek = 4
            } else {
                const startDate = new Date(activePregnancy.startDate)
                const diffInDays = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                targetWeek = Math.max(4, Math.min(40, Math.floor(diffInDays / 7) + 1))
            }
        }

        // Find the closest week data we have (data is sparse)
        // Find the largest week in data that is <= targetWeek
        const validWeeks = weeklyPregnancyData.map(w => w.week).sort((a, b) => b - a)
        const closestWeek = validWeeks.find(w => w <= targetWeek) || 4

        const weekInfo = getWeekInfo(closestWeek)

        return NextResponse.json({
            requestedWeek: targetWeek,
            data: weekInfo,
            allAvailableWeeks: weeklyPregnancyData.map(w => w.week)
        })

    } catch (error: any) {
        console.error("Error fetching baby growth data:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
