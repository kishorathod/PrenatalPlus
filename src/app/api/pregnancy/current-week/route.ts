import { NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const pregnancy = await prisma.pregnancy.findFirst({
            where: {
                userId: session.user.id!,
                status: "ACTIVE"
            }
        })

        if (!pregnancy) {
            return NextResponse.json({ week: null })
        }

        return NextResponse.json({ week: pregnancy.currentWeek })
    } catch (error) {
        console.error("Error fetching pregnancy week:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
