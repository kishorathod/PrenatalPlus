"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getDoctorPatients() {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { patients: [], error: "Unauthorized" }
    }

    try {
        const patients = await prisma.user.findMany({
            where: {
                role: "PATIENT",
            },
            include: {
                pregnancies: {
                    where: {
                        status: "ACTIVE",
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                },
                _count: {
                    select: {
                        appointments: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        })

        return { patients, error: null }
    } catch (error) {
        console.error("Error fetching patients:", error)
        return { patients: [], error: "Failed to fetch patients" }
    }
}

export async function getDoctorUpcomingAppointments() {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { appointments: [], error: "Unauthorized" }
    }

    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorName: session.user.name,
                date: {
                    gte: new Date(),
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        pregnancies: {
                            where: {
                                status: "ACTIVE",
                            },
                            take: 1,
                        },
                    },
                },
            },
            orderBy: {
                date: "asc",
            },
            take: 10,
        })

        const formattedAppointments = appointments.map(apt => ({
            ...apt,
            appointmentDate: apt.date,
            patient: apt.user
        }))

        return { appointments: formattedAppointments, error: null }
    } catch (error) {
        console.error("Error fetching appointments:", error)
        return { appointments: [], error: "Failed to fetch appointments" }
    }
}

export async function getDoctorStats() {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { stats: null, error: "Unauthorized" }
    }

    try {
        const [totalPatients, todayAppointments] = await Promise.all([
            prisma.user.count({
                where: {
                    role: "PATIENT",
                },
            }),
            prisma.appointment.count({
                where: {
                    doctorName: session.user.name,
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lt: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                },
            }),
        ])

        return {
            stats: {
                totalPatients,
                todayAppointments,
                highRiskCount: 0,
            },
            error: null,
        }
    } catch (error) {
        console.error("Error fetching stats:", error)
        return { stats: null, error: "Failed to fetch stats" }
    }
}

export async function getHighRiskPatients() {
    // Temporarily disabled - riskLevel field not in DB yet
    return { patients: [], error: null }
}

export async function getDoctorNotes() {
    // Temporarily disabled - medicalNote model not in DB yet
    return { notes: [], error: null }
}

export async function getPatientVitalsHistory(patientId: string) {
    // Temporarily disabled - vitalReading model not in DB yet
    return { vitals: [], error: null }
}

export async function getPatientDetails(patientId: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { patient: null, error: "Unauthorized" }
    }

    try {
        const patient = await prisma.user.findUnique({
            where: {
                id: patientId,
                role: "PATIENT",
            },
            include: {
                pregnancies: {
                    where: {
                        status: "ACTIVE",
                    },
                    take: 1,
                },
                appointments: {
                    orderBy: {
                        date: "desc",
                    },
                    take: 5,
                },
                reports: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 5,
                },
            },
        })

        if (!patient) {
            return { patient: null, error: "Patient not found" }
        }

        return { patient, error: null }
    } catch (error) {
        console.error("Error fetching patient details:", error)
        return { patient: null, error: "Failed to fetch patient details" }
    }
}

export async function addMedicalNote(data: {
    patientId: string
    content: string
    category?: string
}) {
    // Temporarily disabled - medicalNote model not in DB yet
    return { note: null, error: "Medical notes feature temporarily unavailable" }
}
