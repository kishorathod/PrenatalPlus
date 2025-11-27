"use server"

import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function createDoctor(data: any) {
    try {
        const { name, email, password } = data

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { error: "User with this email already exists" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const doctor = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: UserRole.DOCTOR,
            },
        })

        console.log(`Created doctor ${name} (${email})`)
        revalidatePath("/admin/doctors")
        return { success: true }
    } catch (error) {
        console.error("Error creating doctor:", error)
        return { error: "Failed to create doctor" }
    }
}

export async function createAdmin(data: any) {
    try {
        const { name, email, password } = data

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { error: "User with this email already exists" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: UserRole.ADMIN,
            },
        })

        return { success: true }
    } catch (error) {
        console.error("Error creating admin:", error)
        return { error: "Failed to create admin" }
    }
}

export async function checkAnyAdminExists() {
    try {
        const count = await prisma.user.count({
            where: { role: UserRole.ADMIN }
        })
        return count > 0
    } catch (error) {
        console.error("Error checking admin existence:", error)
        return true // Fail safe
    }
}

export async function getSystemStats() {
    try {
        const [totalPatients, totalDoctors, appointmentsToday, activePregnancies] = await Promise.all([
            prisma.user.count({ where: { role: UserRole.PATIENT } }),
            prisma.user.count({ where: { role: UserRole.DOCTOR } }),
            prisma.appointment.count({
                where: {
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lt: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                },
            }),
            prisma.pregnancy.count({ where: { status: "ACTIVE" } }),
        ])

        return {
            totalPatients,
            totalDoctors,
            appointmentsToday,
            activePregnancies,
        }
    } catch (error) {
        console.error("Error fetching system stats:", error)
        return {
            totalPatients: 0,
            totalDoctors: 0,
            appointmentsToday: 0,
            activePregnancies: 0,
        }
    }
}

export async function getDoctors() {
    try {
        const doctors = await prisma.user.findMany({
            where: { role: UserRole.DOCTOR },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                _count: {
                    select: { appointments: true }
                }
            },
            orderBy: { createdAt: "desc" },
        })
        return { doctors }
    } catch (error) {
        console.error("Error fetching doctors:", error)
        return { error: `Failed to fetch doctors: ${(error as Error).message}` }
    }
}

export async function getPatients() {
    try {
        const patients = await prisma.user.findMany({
            where: { role: UserRole.PATIENT },
            select: {
                id: true,
                name: true,
                email: true,
                dateOfBirth: true,
                pregnancies: {
                    where: { status: "ACTIVE" },
                    select: {
                        currentWeek: true,
                        dueDate: true,
                    },
                    take: 1
                },
                _count: {
                    select: { appointments: true }
                }
            },
            orderBy: { createdAt: "desc" },
        })
        return { patients }
    } catch (error) {
        console.error("Error fetching patients:", error)
        return { error: "Failed to fetch patients" }
    }
}

export async function getRecentActivity() {
    try {
        // Get recent doctors (last 3)
        const recentDoctors = await prisma.user.findMany({
            where: { role: UserRole.DOCTOR },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: 3,
        })

        // Get recent appointments (last 3)
        const recentAppointments = await prisma.appointment.findMany({
            select: {
                id: true,
                title: true,
                type: true,
                date: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            take: 3,
        })

        // Combine and sort by creation date
        const activities = [
            ...recentDoctors.map(doctor => ({
                type: 'doctor_added' as const,
                title: 'New Doctor Added',
                description: `Dr. ${doctor.name} joined the team`,
                timestamp: doctor.createdAt,
            })),
            ...recentAppointments.map(apt => ({
                type: 'appointment_created' as const,
                title: 'New Appointment',
                description: `${apt.user.name} - ${apt.title}`,
                timestamp: apt.createdAt,
            })),
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5)

        return { activities }
    } catch (error) {
        console.error("Error fetching recent activity:", error)
        return { activities: [] }
    }
}

export async function getAnalyticsData() {
    try {
        // 1. Patient Growth (Last 6 months)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const users = await prisma.user.findMany({
            where: {
                role: UserRole.PATIENT,
                createdAt: { gte: sixMonthsAgo }
            },
            select: { createdAt: true }
        })

        // Group by month
        const patientGrowth = new Map<string, number>()
        // Initialize last 6 months with 0
        for (let i = 5; i >= 0; i--) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            const month = d.toLocaleString('default', { month: 'short' })
            patientGrowth.set(month, 0)
        }

        users.forEach(user => {
            const month = user.createdAt.toLocaleString('default', { month: 'short' })
            if (patientGrowth.has(month)) {
                patientGrowth.set(month, (patientGrowth.get(month) || 0) + 1)
            }
        })

        const growthData = Array.from(patientGrowth.entries()).map(([name, value]) => ({
            name,
            patients: value
        }))

        // 2. Appointment Statistics (By Type)
        const appointments = await prisma.appointment.groupBy({
            by: ['type'],
            _count: {
                type: true
            }
        })

        const appointmentData = appointments.map(apt => ({
            name: apt.type.replace('_', ' '),
            value: apt._count.type
        }))

        return { growthData, appointmentData }
    } catch (error) {
        console.error("Error fetching analytics:", error)
        return { growthData: [], appointmentData: [] }
    }
}
