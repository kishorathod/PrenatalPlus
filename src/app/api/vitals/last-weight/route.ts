import { NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const lastWeightVital = await prisma.vitalSign.findFirst({
            where: {
                userId: session.user.id!,
                type: "WEIGHT"
            },
            orderBy: {
                recordedAt: "desc"
            }
        })

        return NextResponse.json({ weight: lastWeightVital?.value || null })
    } catch (error) {
        console.error("Error fetching last weight:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
