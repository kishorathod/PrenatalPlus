"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"

// Get recent activity for doctor dashboard
export async function getRecentActivity() {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { activities: [], error: "Unauthorized" }
    }

    try {
        // Get recent vitals, appointments, and messages
        const [recentVitals, recentAppointments, recentMessages] = await Promise.all([
            prisma.vitalReading.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: { id: true, name: true, avatar: true }
                    }
                }
            }),
            prisma.appointment.findMany({
                where: { doctorId: session.user.id },
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: { id: true, name: true, avatar: true }
                    }
                }
            }),
            prisma.message.findMany({
                where: {
                    conversation: {
                        doctorId: session.user.id
                    },
                    senderId: { not: session.user.id }
                },
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    sender: {
                        select: { id: true, name: true, avatar: true }
                    }
                }
            })
        ])

        // Combine and sort by date
        const activities = [
            ...recentVitals.map(v => ({
                id: v.id,
                type: "VITALS" as const,
                user: v.user,
                date: v.createdAt,
                data: { systolic: v.systolic, diastolic: v.diastolic, heartRate: v.heartRate }
            })),
            ...recentAppointments.map(a => ({
                id: a.id,
                type: "APPOINTMENT" as const,
                user: a.user,
                date: a.createdAt,
                data: { title: a.title, appointmentDate: a.date }
            })),
            ...recentMessages.map(m => ({
                id: m.id,
                type: "MESSAGE" as const,
                user: m.sender,
                date: m.createdAt,
                data: { content: m.content }
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

        return { activities, error: null }
    } catch (error) {
        console.error("Error fetching recent activity:", error)
        return { activities: [], error: "Failed to fetch recent activity" }
    }
}

// Get pending tasks for doctor
export async function getPendingTasks() {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        return { tasks: null, error: "Unauthorized" }
    }

    try {
        const [unreadMessages, pendingAppointments, patientsWithAlerts] = await Promise.all([
            // Unread messages count
            prisma.message.count({
                where: {
                    conversation: {
                        doctorId: session.user.id
                    },
                    senderId: { not: session.user.id },
                    read: false
                }
            }),
            // Appointments needing confirmation (scheduled but not confirmed)
            prisma.appointment.count({
                where: {
                    doctorId: session.user.id,
                    status: "SCHEDULED",
                    date: { gte: new Date() }
                }
            }),
            // Patients with unacknowledged alerts
            prisma.user.count({
                where: {
                    role: "PATIENT",
                    vitalReadings: {
                        some: {
                            alerts: {
                                some: {
                                    acknowledged: false
                                }
                            }
                        }
                    }
                }
            })
        ])

        return {
            tasks: {
                unreadMessages,
                pendingAppointments,
                patientsWithAlerts
            },
            error: null
        }
    } catch (error) {
        console.error("Error fetching pending tasks:", error)
        return { tasks: null, error: "Failed to fetch pending tasks" }
    }
}
