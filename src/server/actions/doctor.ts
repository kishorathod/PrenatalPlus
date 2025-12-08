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
                    include: {
                        alerts: true,
                    },
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
        const [totalPatients, todayAppointments, highRiskCount] = await Promise.all([
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
            prisma.user.count({
                where: {
                    role: "PATIENT",
                    pregnancies: {
                        some: {
                            status: "ACTIVE",
                            riskLevel: "HIGH",
                        },
                    },
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
                    where: {
                        hasAlerts: true,
                    },
                    orderBy: {
                        recordedAt: "desc",
                    },
                    take: 3,
                    include: {
                        alerts: {
                            where: {
                                acknowledged: false,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        })

        return { patients, error: null }
    } catch (error) {
        console.error("Error fetching high-risk patients:", error)
        return { patients: [], error: "Failed to fetch high-risk patients" }
    }
}

export async function getDoctorNotes(patientId?: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { notes: [], error: "Unauthorized" }
    }

    try {
        const notes = await prisma.medicalNote.findMany({
            where: {
                doctorId: session.user.id,
                ...(patientId && { patientId }),
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
            take: 50,
        })

        return { notes, error: null }
    } catch (error) {
        console.error("Error fetching doctor notes:", error)
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
            include: {
                alerts: true,
                pregnancy: {
                    select: {
                        currentWeek: true,
                    },
                },
            },
            orderBy: {
                recordedAt: "desc",
            },
            take: 100,
        })

        return { vitals, error: null }
    } catch (error) {
        console.error("Error fetching vital history:", error)
        return { vitals: [], error: "Failed to fetch vitals" }
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
                doctorId: session.user.id!,
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

        revalidatePath(`/doctor/patients/${data.patientId}`)
        revalidatePath("/doctor/notes")

        // Send notification to patient
        const { createNotification } = await import("./notifications")
        await createNotification({
            userId: data.patientId,
            title: "New Medical Note",
            message: `Dr. ${session.user.name} added a new note to your medical record`,
            type: "GENERAL",
            priority: "NORMAL",
            link: "/patient/dashboard"
        })

        return { note, error: null }
    } catch (error) {
        console.error("Error adding medical note:", error)
        return { note: null, error: "Failed to add medical note" }
    }
}

// Update patient pregnancy risk level
export async function updatePatientRiskLevel(pregnancyId: string, riskLevel: "LOW" | "MEDIUM" | "HIGH") {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { success: false, error: "Unauthorized" }
    }

    try {
        await prisma.pregnancy.update({
            where: { id: pregnancyId },
            data: { riskLevel },
        })

        revalidatePath("/doctor/patients")
        return { success: true, error: null }
    } catch (error) {
        console.error("Error updating risk level:", error)
        return { success: false, error: "Failed to update risk level" }
    }
}

// Create prescription for patient
export async function createPrescription(data: {
    patientId: string
    pregnancyId?: string
    medication: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
    reason?: string
    sideEffects?: string
}) {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { prescription: null, error: "Unauthorized" }
    }

    try {
        const prescription = await prisma.prescription.create({
            data: {
                patientId: data.patientId,
                doctorId: session.user.id!,
                pregnancyId: data.pregnancyId,
                medication: data.medication,
                dosage: data.dosage,
                frequency: data.frequency,
                duration: data.duration,
                instructions: data.instructions,
                reason: data.reason,
                sideEffects: data.sideEffects,
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

        revalidatePath(`/doctor/patients/${data.patientId}`)

        // Send notification to patient
        const { createNotification } = await import("./notifications")
        await createNotification({
            userId: data.patientId,
            title: "New Prescription",
            message: `Dr. ${session.user.name} prescribed ${data.medication} for you`,
            type: "GENERAL",
            priority: "HIGH",
            link: "/patient/dashboard"
        })

        return { prescription, error: null }
    } catch (error) {
        console.error("Error creating prescription:", error)
        return { prescription: null, error: "Failed to create prescription" }
    }
}

// Request lab test for patient
export async function requestLabTest(data: {
    patientId: string
    pregnancyId?: string
    testType: string
    testName: string
    description?: string
    urgency?: "ROUTINE" | "URGENT" | "EMERGENCY"
    preferredDate?: Date
}) {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { labTest: null, error: "Unauthorized" }
    }

    try {
        const labTest = await prisma.labTestRequest.create({
            data: {
                patientId: data.patientId,
                doctorId: session.user.id!,
                pregnancyId: data.pregnancyId,
                testType: data.testType as any,
                testName: data.testName,
                description: data.description,
                urgency: data.urgency || "ROUTINE",
                preferredDate: data.preferredDate,
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

        revalidatePath(`/doctor/patients/${data.patientId}`)
        return { labTest, error: null }
    } catch (error) {
        console.error("Error requesting lab test:", error)
        return { labTest: null, error: "Failed to request lab test" }
    }
}

// Acknowledge vital alert
export async function acknowledgeVitalAlert(alertId: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { success: false, error: "Unauthorized" }
    }

    try {
        await prisma.vitalAlert.update({
            where: { id: alertId },
            data: {
                acknowledged: true,
                acknowledgedAt: new Date(),
            },
        })

        revalidatePath("/doctor/patients")
        revalidatePath("/doctor/dashboard")
        return { success: true, error: null }
    } catch (error) {
        console.error("Error acknowledging alert:", error)
        return { success: false, error: "Failed to acknowledge alert" }
    }
}

// Get patients with active alerts
export async function getPatientsWithAlerts() {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { patients: [], error: "Unauthorized" }
    }

    try {
        const patients = await prisma.user.findMany({
            where: {
                role: "PATIENT",
                vitalReadings: {
                    some: {
                        hasAlerts: true,
                        alerts: {
                            some: {
                                acknowledged: false,
                            },
                        },
                    },
                },
            },
            include: {
                pregnancies: {
                    where: {
                        status: "ACTIVE",
                    },
                    take: 1,
                },
                vitalReadings: {
                    where: {
                        hasAlerts: true,
                    },
                    orderBy: {
                        recordedAt: "desc",
                    },
                    take: 1,
                    include: {
                        alerts: {
                            where: {
                                acknowledged: false,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        })

        return { patients, error: null }
    } catch (error) {
        console.error("Error fetching patients with alerts:", error)
        return { patients: [], error: "Failed to fetch patients with alerts" }
    }
}

