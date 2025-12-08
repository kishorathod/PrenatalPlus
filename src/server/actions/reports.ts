"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getReports(userId?: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        const targetUserId = userId || session.user.id

        const reports = await prisma.medicalReport.findMany({
            where: { userId: targetUserId },
            orderBy: { createdAt: "desc" },
            include: {
                pregnancy: {
                    select: { currentWeek: true }
                }
            }
        })

        return { reports, error: null }
    } catch (error) {
        console.error("Error fetching reports:", error)
        return { reports: [], error: "Failed to fetch reports" }
    }
}

export async function uploadReport(data: {
    title: string
    type: string
    category?: string
    description?: string
    fileUrl: string
    fileName: string
    fileSize: number
    mimeType: string
    reportDate?: string
    doctorName?: string
    clinicName?: string
}) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        // Get active pregnancy
        const activePregnancy = await prisma.pregnancy.findFirst({
            where: {
                userId: session.user.id,
                status: "ACTIVE"
            }
        })

        const report = await prisma.medicalReport.create({
            data: {
                userId: session.user.id,
                pregnancyId: activePregnancy?.id,
                title: data.title,
                type: data.type as any,
                category: data.category as any,
                description: data.description,
                fileUrl: data.fileUrl,
                fileName: data.fileName,
                fileSize: data.fileSize,
                mimeType: data.mimeType,
                reportDate: data.reportDate ? new Date(data.reportDate) : new Date(),
                doctorName: data.doctorName,
                clinicName: data.clinicName
            }
        })

        revalidatePath("/patient/reports")
        revalidatePath("/reports")

        // Send notification to assigned doctor if exists
        if (session.user.role === "PATIENT") {
            const assignment = await prisma.patientAssignment.findFirst({
                where: { patientId: session.user.id }
            })

            if (assignment) {
                const { createNotification } = await import("./notifications")
                await createNotification({
                    userId: assignment.doctorId,
                    title: "New Report Uploaded",
                    message: `${session.user.name} uploaded a new ${data.type} report`,
                    type: "REPORT_UPLOADED",
                    priority: "NORMAL",
                    link: "/doctor/patients"
                })
            }
        }

        return { report, error: null }
    } catch (error) {
        console.error("Error uploading report:", error)
        return { report: null, error: "Failed to upload report" }
    }
}

export async function deleteReport(reportId: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        // Verify ownership
        const report = await prisma.medicalReport.findUnique({
            where: { id: reportId }
        })

        if (!report || report.userId !== session.user.id) {
            return { error: "Unauthorized to delete this report" }
        }

        await prisma.medicalReport.delete({
            where: { id: reportId }
        })

        revalidatePath("/patient/reports")
        revalidatePath("/reports")

        return { success: true, error: null }
    } catch (error) {
        console.error("Error deleting report:", error)
        return { success: false, error: "Failed to delete report" }
    }
}

export async function updateReportNotes(reportId: string, notes: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { error: "Unauthorized" }
    }

    try {
        const report = await prisma.medicalReport.update({
            where: { id: reportId },
            data: { doctorNotes: notes }
        })

        revalidatePath("/doctor/patients")

        return { report, error: null }
    } catch (error) {
        console.error("Error updating report notes:", error)
        return { report: null, error: "Failed to update notes" }
    }
}
