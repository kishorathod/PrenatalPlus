"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Get all doctor access assignments for current patient
export async function getMyDoctorAccess() {
    const session = await auth()
    if (!session?.user || session.user.role !== "PATIENT") {
        return { assignments: [], error: "Unauthorized" }
    }

    try {
        const assignments = await prisma.patientAssignment.findMany({
            where: {
                patientId: session.user.id
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        specialization: true,
                        hospitalClinic: true,
                        yearsOfExperience: true
                    }
                },
                pregnancy: {
                    select: {
                        id: true,
                        currentWeek: true,
                        dueDate: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return { assignments, error: null }
    } catch (error) {
        console.error("Error fetching doctor access:", error)
        return { assignments: [], error: "Failed to fetch doctor access" }
    }
}

// Grant doctor access (approve pending request)
export async function grantDoctorAccess(assignmentId: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== "PATIENT") {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const assignment = await prisma.patientAssignment.findUnique({
            where: { id: assignmentId }
        })

        if (!assignment || assignment.patientId !== session.user.id) {
            return { success: false, error: "Assignment not found" }
        }

        await prisma.patientAssignment.update({
            where: { id: assignmentId },
            data: {
                consentStatus: "GRANTED",
                consentGrantedAt: new Date()
            }
        })

        revalidatePath("/patient/privacy")
        return { success: true, error: null }
    } catch (error) {
        console.error("Error granting access:", error)
        return { success: false, error: "Failed to grant access" }
    }
}

// Revoke doctor access
export async function revokeDoctorAccess(assignmentId: string, reason?: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== "PATIENT") {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const assignment = await prisma.patientAssignment.findUnique({
            where: { id: assignmentId }
        })

        if (!assignment || assignment.patientId !== session.user.id) {
            return { success: false, error: "Assignment not found" }
        }

        await prisma.patientAssignment.update({
            where: { id: assignmentId },
            data: {
                consentStatus: "REVOKED",
                consentRevokedAt: new Date(),
                revokeReason: reason
            }
        })

        revalidatePath("/patient/privacy")
        return { success: true, error: null }
    } catch (error) {
        console.error("Error revoking access:", error)
        return { success: false, error: "Failed to revoke access" }
    }
}

// Deny pending access request
export async function denyDoctorAccess(assignmentId: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== "PATIENT") {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const assignment = await prisma.patientAssignment.findUnique({
            where: { id: assignmentId }
        })

        if (!assignment || assignment.patientId !== session.user.id) {
            return { success: false, error: "Assignment not found" }
        }

        // For denied requests, we can either delete or mark as REVOKED
        await prisma.patientAssignment.update({
            where: { id: assignmentId },
            data: {
                consentStatus: "REVOKED",
                consentRevokedAt: new Date(),
                revokeReason: "Request denied by patient"
            }
        })

        revalidatePath("/patient/privacy")
        return { success: true, error: null }
    } catch (error) {
        console.error("Error denying access:", error)
        return { success: false, error: "Failed to deny access" }
    }
}
