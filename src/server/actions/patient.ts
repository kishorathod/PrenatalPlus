"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { differenceInWeeks } from "date-fns"

export async function getPatientDashboardData() {
    try {
        const session = await auth()
        if (!session?.user) {
            return { error: "Unauthorized" }
        }

        const userId = session.user.id

        // Get active pregnancy
        const activePregnancy = await prisma.pregnancy.findFirst({
            where: {
                userId,
                status: "ACTIVE"
            }
        })

        // Get next appointment
        const now = new Date()
        console.log("Fetching appointments after:", now.toISOString())

        const nextAppointment = await prisma.appointment.findFirst({
            where: {
                userId,
                date: {
                    gte: now
                }
            },
            orderBy: { date: "asc" }
        })

        console.log("Found appointment:", nextAppointment ? {
            id: nextAppointment.id,
            date: nextAppointment.date,
            title: nextAppointment.title
        } : "None")

        // Get latest vitals
        const latestVital = await prisma.vitalReading.findFirst({
            where: {
                userId
            },
            orderBy: { recordedAt: "desc" }
        })

        // Calculate current week if pregnancy exists
        let currentWeek = null
        if (activePregnancy) {
            currentWeek = Math.min(
                40,
                Math.max(0, differenceInWeeks(new Date(), new Date(activePregnancy.startDate)))
            )
        }

        return {
            pregnancy: activePregnancy ? {
                ...activePregnancy,
                currentWeek
            } : null,
            nextAppointment,
            latestVital,
            error: null
        }
    } catch (error) {
        console.error("Error fetching patient dashboard data:", error)
        return { error: "Failed to fetch dashboard data" }
    }
}
