import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const alertId = params.id
        const userId = session.user.id

        // Verify the alert belongs to the user
        const alert = await prisma.vitalAlert.findFirst({
            where: {
                id: alertId,
                reading: { userId },
            },
        })

        if (!alert) {
            return NextResponse.json(
                { error: "Alert not found" },
                { status: 404 }
            )
        }

        // Acknowledge the alert
        const updatedAlert = await prisma.vitalAlert.update({
            where: { id: alertId },
            data: {
                acknowledged: true,
                acknowledgedAt: new Date(),
            },
            include: {
                reading: true,
            },
        })

        return NextResponse.json(updatedAlert)
    } catch (error: any) {
        console.error("Error acknowledging alert:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
