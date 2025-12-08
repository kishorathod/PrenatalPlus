"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { MedicationFrequency } from "@prisma/client"

async function checkAuth() {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Unauthorized")
    }
    return session
}

export async function createMedicationReminder(data: {
    name: string
    dosage: string
    frequency: MedicationFrequency
    timeOfDay: string[]
    startDate: Date
    endDate?: Date
}) {
    const session = await checkAuth()

    try {
        const reminder = await prisma.medicationReminder.create({
            data: {
                userId: session.user.id!,
                ...data
            }
        })

        revalidatePath("/patient/medications")
        return { success: true, reminder }
    } catch (error) {
        console.error("Error creating reminder:", error)
        return { error: "Failed to create reminder" }
    }
}

export async function getMedicationReminders() {
    const session = await checkAuth()

    try {
        const reminders = await prisma.medicationReminder.findMany({
            where: {
                userId: session.user.id!,
                isActive: true
            },
            include: {
                logs: {
                    where: {
                        scheduledFor: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0)),
                            lt: new Date(new Date().setHours(23, 59, 59, 999))
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return { reminders, error: null }
    } catch (error) {
        console.error("Error fetching reminders:", error)
        return { reminders: [], error: "Failed to fetch reminders" }
    }
}

export async function logMedicationIntake(reminderId: string, taken: boolean, notes?: string) {
    const session = await checkAuth()

    try {
        const log = await prisma.medicationLog.create({
            data: {
                reminderId,
                taken,
                takenAt: taken ? new Date() : null,
                skipped: !taken,
                notes,
                scheduledFor: new Date() // For now, logging for "now"
            }
        })

        revalidatePath("/patient/medications")
        return { success: true, log }
    } catch (error) {
        console.error("Error logging medication:", error)
        return { error: "Failed to log medication" }
    }
}

export async function deleteMedicationReminder(id: string) {
    const session = await checkAuth()

    try {
        await prisma.medicationReminder.delete({
            where: {
                id,
                userId: session.user.id!
            }
        })

        revalidatePath("/patient/medications")
        return { success: true }
    } catch (error) {
        console.error("Error deleting reminder:", error)
        return { error: "Failed to delete reminder" }
    }
}

export async function toggleMedicationStatus(id: string, isActive: boolean) {
    const session = await checkAuth()

    try {
        await prisma.medicationReminder.update({
            where: {
                id,
                userId: session.user.id!
            },
            data: { isActive }
        })

        revalidatePath("/patient/medications")
        return { success: true }
    } catch (error) {
        console.error("Error updating status:", error)
        return { error: "Failed to update status" }
    }
}
