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
                vitalReadings: {
                    orderBy: {
                        recordedAt: "desc",
                    },
                    take: 1,
                },
                _count: {
                    select: {
                        appointments: true,
                        vitalReadings: true,
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
        // Workaround: Query by doctorName since doctorId column is missing/unreliable
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorName: session.user.name, // Use name instead of ID
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

        // Map user to patient to match expected interface if needed, or update usage
        const formattedAppointments = appointments.map(apt => ({
            ...apt,
            appointmentDate: apt.date, // Backwards compatibility for now
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
        const [totalPatients, todayAppointments, highRiskCount] = await Promise.all([
            prisma.user.count({
                where: {
                    role: "PATIENT",
                },
            }),
            prisma.appointment.count({
                where: {
                    doctorName: session.user.name, // Use name instead of ID
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lt: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                },
            }),
            prisma.pregnancy.count({
                where: {
                    status: "ACTIVE",
                    riskLevel: "HIGH",
                },
            }),
        ])

        return {
            stats: {
                totalPatients,
                todayAppointments,
                highRiskCount,
            },
            error: null,
        }
    } catch (error) {
        console.error("Error fetching stats:", error)
        return { stats: null, error: "Failed to fetch stats" }
    }
}

export async function getHighRiskPatients() {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { patients: [], error: "Unauthorized" }
    }

    try {
        const patients = await prisma.user.findMany({
            where: {
                role: "PATIENT",
                pregnancies: {
                    some: {
                        status: "ACTIVE",
                        riskLevel: "HIGH",
                    },
                },
            },
            include: {
                pregnancies: {
                    where: {
                        status: "ACTIVE",
                        riskLevel: "HIGH",
                    },
                    take: 1,
                },
                vitalReadings: {
                    orderBy: {
                        recordedAt: "desc",
                    },
                    take: 1,
                },
            },
            orderBy: {
                name: "asc",
            },
        })

        return { patients, error: null }
    } catch (error) {
        console.error("Error fetching high-risk patients:", error)
        return { patients: [], error: "Failed to fetch high-risk patients" }
    }
}

export async function getDoctorNotes() {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { notes: [], error: "Unauthorized" }
    }

    try {
        const notes = await prisma.medicalNote.findMany({
            where: {
                doctorId: session.user.id,
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return { notes, error: null }
    } catch (error) {
        console.error("Error fetching notes:", error)
        return { notes: [], error: "Failed to fetch notes" }
    }
}

export async function getPatientVitalsHistory(patientId: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { vitals: [], error: "Unauthorized" }
    }

    try {
        const vitals = await prisma.vitalReading.findMany({
            where: {
                userId: patientId,
            },
            orderBy: {
                recordedAt: "desc",
            },
            take: 30,
        })

        return { vitals, error: null }
    } catch (error) {
        console.error("Error fetching vitals history:", error)
        return { vitals: [], error: "Failed to fetch vitals history" }
    }
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
                vitalReadings: {
                    orderBy: {
                        recordedAt: "desc",
                    },
                    take: 10,
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
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { note: null, error: "Unauthorized" }
    }

    try {
        const note = await prisma.medicalNote.create({
            data: {
                patientId: data.patientId,
                doctorId: session.user.id,
                content: data.content,
                category: data.category || "GENERAL",
            },
            include: {
                patient: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        })

        revalidatePath("/doctor/notes")
        revalidatePath(`/doctor/patients/${data.patientId}`)

        return { note, error: null }
    } catch (error) {
        console.error("Error adding medical note:", error)
        return { note: null, error: "Failed to add medical note" }
    }
}
