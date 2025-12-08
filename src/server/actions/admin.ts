"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { UserRole } from "@prisma/client"

// Check if current user is admin
async function checkAdmin() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required")
    }
    return session
}

export async function checkAnyAdminExists() {
    try {
        const count = await prisma.user.count({
            where: { role: "ADMIN" }
        })
        return count > 0
    } catch (error) {
        console.error("Error checking admin existence:", error)
        return true // Fail safe to prevent unauthorized registration if DB fails
    }
}

export async function createAdmin(data: any) {
    try {
        const { name, email, password } = data
        const { hash } = await import("bcryptjs")

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { error: "User with this email already exists" }
        }

        const hashedPassword = await hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "ADMIN",
                isVerified: true
            },
        })

        return { success: true }
    } catch (error) {
        console.error("Error creating admin:", error)
        return { error: "Failed to create admin" }
    }
}

export async function getAdminStats() {
    await checkAdmin()

    try {
        const [
            totalUsers,
            totalPatients,
            totalDoctors,
            appointmentsToday,
            pendingVerifications
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: "PATIENT" } }),
            prisma.user.count({ where: { role: "DOCTOR" } }),
            prisma.appointment.count({
                where: {
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lt: new Date(new Date().setHours(24, 0, 0, 0))
                    }
                }
            }),
            prisma.user.count({
                where: {
                    role: "DOCTOR",
                    isVerified: false
                }
            })
        ])

        return {
            stats: {
                totalUsers,
                totalPatients,
                totalDoctors,
                appointmentsToday,
                pendingVerifications
            },
            error: null
        }
    } catch (error) {
        console.error("Error fetching admin stats:", error)
        return { stats: null, error: "Failed to fetch stats" }
    }
}

export async function getRecentUsers() {
    await checkAdmin()

    try {
        const users = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                avatar: true
            }
        })

        return { users, error: null }
    } catch (error) {
        console.error("Error fetching recent users:", error)
        return { users: [], error: "Failed to fetch recent users" }
    }
}

export async function getAllUsers(role?: UserRole, search?: string) {
    await checkAdmin()

    try {
        const where: any = {}
        if (role) where.role = role
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } }
            ]
        }

        const users = await prisma.user.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                isVerified: true,
                avatar: true,
                _count: {
                    select: {
                        appointments: true,
                        doctorAppointments: true
                    }
                }
            }
        })

        return { users, error: null }
    } catch (error) {
        console.error("Error fetching users:", error)
        return { users: [], error: "Failed to fetch users" }
    }
}

export async function deleteUser(userId: string) {
    await checkAdmin()

    try {
        await prisma.user.delete({
            where: { id: userId }
        })

        revalidatePath("/admin/users")
        return { success: true, error: null }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { success: false, error: "Failed to delete user" }
    }
}

export async function updateUserRole(userId: string, role: UserRole) {
    await checkAdmin()

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role }
        })

        revalidatePath("/admin/users")
        return { success: true, error: null }
    } catch (error) {
        console.error("Error updating user role:", error)
        return { success: false, error: "Failed to update user role" }
    }
}

export async function getUnverifiedDoctors() {
    await checkAdmin()

    try {
        const doctors = await prisma.user.findMany({
            where: {
                role: "DOCTOR",
                isVerified: false
            },
            orderBy: { createdAt: "desc" }
        })

        return { doctors, error: null }
    } catch (error) {
        console.error("Error fetching unverified doctors:", error)
        return { doctors: [], error: "Failed to fetch doctors" }
    }
}

export async function verifyDoctor(userId: string, approved: boolean) {
    await checkAdmin()

    try {
        if (approved) {
            await prisma.user.update({
                where: { id: userId },
                data: { isVerified: true }
            })

            // Send notification
            const { createNotification } = await import("./notifications")
            await createNotification({
                userId,
                title: "Account Verified",
                message: "Your doctor account has been verified. You can now access the dashboard.",
                type: "SYSTEM_ALERT",
                priority: "HIGH",
                link: "/doctor/dashboard"
            })
        } else {
            // If rejected, we might want to delete or just leave unverified
            // For now, let's just delete rejected accounts to keep it clean
            await prisma.user.delete({
                where: { id: userId }
            })
        }

        revalidatePath("/admin/doctors")
        return { success: true, error: null }
    } catch (error) {
        console.error("Error verifying doctor:", error)
        return { success: false, error: "Failed to verify doctor" }
    }
}

// ============ DEPARTMENTS ============

export async function getDepartments() {
    await checkAdmin()

    try {
        const departments = await prisma.department.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { doctors: true }
                }
            }
        })

        return { departments, error: null }
    } catch (error) {
        console.error("Error fetching departments:", error)
        return { departments: [], error: "Failed to fetch departments" }
    }
}

export async function createDepartment(data: {
    name: string
    description?: string
    location?: string
    headDoctor?: string
    contactPhone?: string
}) {
    const session = await checkAdmin()

    try {
        const department = await prisma.department.create({
            data
        })

        // Log the action
        await logAction({
            action: "CREATE_DEPARTMENT",
            details: `Created department: ${data.name}`,
            adminId: session.user.id!,
            targetId: department.id,
            targetType: "DEPARTMENT"
        })

        revalidatePath("/admin/departments")
        return { success: true, department, error: null }
    } catch (error) {
        console.error("Error creating department:", error)
        return { success: false, department: null, error: "Failed to create department" }
    }
}

export async function deleteDepartment(departmentId: string) {
    const session = await checkAdmin()

    try {
        const department = await prisma.department.findUnique({
            where: { id: departmentId },
            select: { name: true }
        })

        await prisma.department.delete({
            where: { id: departmentId }
        })

        // Log the action
        await logAction({
            action: "DELETE_DEPARTMENT",
            details: `Deleted department: ${department?.name}`,
            adminId: session.user.id!,
            targetId: departmentId,
            targetType: "DEPARTMENT"
        })

        revalidatePath("/admin/departments")
        return { success: true, error: null }
    } catch (error) {
        console.error("Error deleting department:", error)
        return { success: false, error: "Failed to delete department" }
    }
}

// ============ SYSTEM LOGS ============

export async function getSystemLogs(limit: number = 50) {
    await checkAdmin()

    try {
        const logs = await prisma.systemLog.findMany({
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                admin: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        return { logs, error: null }
    } catch (error) {
        console.error("Error fetching system logs:", error)
        return { logs: [], error: "Failed to fetch system logs" }
    }
}

export async function logAction(data: {
    action: string
    details?: string
    adminId: string
    targetId?: string
    targetType?: string
    ipAddress?: string
    userAgent?: string
}) {
    try {
        await prisma.systemLog.create({
            data
        })
    } catch (error) {
        console.error("Error logging action:", error)
        // Don't throw - logging failures shouldn't break the main action
    }
}

// ============ ANALYTICS ============

export async function getAnalyticsData() {
    const growthData = [
        { name: "Jan", patients: 45 },
        { name: "Feb", patients: 52 },
        { name: "Mar", patients: 61 },
        { name: "Apr", patients: 70 },
        { name: "May", patients: 85 },
        { name: "Jun", patients: 95 },
    ]

    const appointmentData = [
        { name: "Completed", value: 145 },
        { name: "Pending", value: 32 },
        { name: "Cancelled", value: 18 },
    ]

    return { growthData, appointmentData }
}
  
export async function getPatients() {  
    await checkAdmin()  
  
    try {  
        const patients = await prisma.user.findMany({  
            where: { role: "PATIENT" },  
            orderBy: { createdAt: "desc" },  
            select: {  
                id: true,  
                name: true,  
                email: true,  
                createdAt: true,  
                avatar: true,  
                pregnancies: {  
                    where: { status: "ACTIVE" },  
                    take: 1,  
                    select: { id: true, currentWeek: true, riskLevel: true }  
                }  
            }  
        })  
  
        return { patients, error: null }  
    } catch (error) {  
        console.error("Error fetching patients:", error)  
        return { patients: [], error: "Failed to fetch patients" }  
    }  
} 
  
export async function createDoctor(data: any) {  
    await checkAdmin()  
  
    try {  
        const { name, email, password, specialization } = data  
        const { hash } = await import("bcryptjs")  
  
        const existingUser = await prisma.user.findUnique({ where: { email } })  
        if (existingUser) return { error: "User with this email already exists" }  
  
        const hashedPassword = await hash(password, 10)  
  
        await prisma.user.create({  
            data: { name, email, password: hashedPassword, role: "DOCTOR", specialization, isVerified: true }  
        })  
  
        revalidatePath("/admin/doctors")  
        return { success: true, error: null }  
    } catch (error) {  
        console.error("Error creating doctor:", error)  
        return { success: false, error: "Failed to create doctor" }  
    }  
} 
