"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"

export async function getAvailableDoctors() {
    try {
        const session = await auth()
        if (!session?.user) {
            return { error: "Unauthorized" }
        }

        const doctors = await prisma.user.findMany({
            where: {
                role: "DOCTOR"
            },
            select: {
                id: true,
                name: true,
                email: true,
                // specialization: true  // TODO: Add back after running migration
            }
        })

        return { doctors }
    } catch (error) {
        console.error("Error fetching doctors:", error)
        return { error: "Failed to fetch doctors" }
    }
}
