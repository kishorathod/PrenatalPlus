"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getDoctors() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        const doctors = await prisma.user.findMany({
            where: {
                role: "DOCTOR"
            },
            select: {
                id: true,
                name: true,
                email: true,
                specialization: true,
                avatar: true
            }
        })
        return { doctors }
    } catch (error) {
        console.error("Error fetching doctors:", error)
        return { error: "Failed to fetch doctors" }
    }
}

export async function getAvailableSlots(doctorId: string, dateStr: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        const date = new Date(dateStr)
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        // Fetch existing appointments
        const existingAppointments = await prisma.appointment.findMany({
            where: {
                doctorId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: {
                    not: "CANCELLED"
                }
            },
            select: {
                date: true
            }
        })

        // Generate slots (9 AM to 5 PM, 30 min intervals)
        const slots = []
        const startHour = 9
        const endHour = 17 // 5 PM

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute of [0, 30]) {
                const slotTime = new Date(date)
                slotTime.setHours(hour, minute, 0, 0)

                // Check if slot is in the past (if today)
                if (slotTime < new Date()) {
                    continue
                }

                // Check if slot is taken
                const isTaken = existingAppointments.some(appt => {
                    const apptTime = new Date(appt.date)
                    return apptTime.getHours() === hour && apptTime.getMinutes() === minute
                })

                if (!isTaken) {
                    slots.push(slotTime.toISOString())
                }
            }
        }

        return { slots }

    } catch (error) {
        console.error("Error fetching slots:", error)
        return { error: "Failed to fetch available slots" }
    }
}

export async function bookAppointment(data: {
    doctorId: string
    date: string // ISO string of the selected slot
    reason?: string
    type?: string
}) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        const appointmentDate = new Date(data.date)

        // Double check availability
        const existing = await prisma.appointment.findFirst({
            where: {
                doctorId: data.doctorId,
                date: appointmentDate,
                status: { not: "CANCELLED" }
            }
        })

        if (existing) {
            return { error: "This slot is no longer available" }
        }

        // Get doctor details for notification
        const doctor = await prisma.user.findUnique({
            where: { id: data.doctorId },
            select: { name: true }
        })

        const appointment = await prisma.appointment.create({
            data: {
                userId: session.user.id,
                doctorId: data.doctorId,
                date: appointmentDate,
                title: "Prenatal Checkup", // Required field
                purpose: data.reason || "Routine Checkup", // Map reason to purpose
                status: "SCHEDULED",
                type: (data.type as any) || "ROUTINE_CHECKUP"
            }
        })

        revalidatePath("/patient/appointments")
        revalidatePath("/patient/dashboard")

        // Send notification to patient
        const { sendAppointmentNotification } = await import("./notifications")
        await sendAppointmentNotification(
            session.user.id,
            `Appointment with Dr. ${doctor?.name || "Doctor"}`,
            appointmentDate,
            "APPOINTMENT_CREATED"
        )

        // Also notify the doctor
        await sendAppointmentNotification(
            data.doctorId,
            `New appointment with ${session.user.name || "Patient"}`,
            appointmentDate,
            "APPOINTMENT_CREATED"
        )

        return { success: true, appointment }

    } catch (error) {
        console.error("Error booking appointment:", error)
        return { error: "Failed to book appointment" }
    }
}
