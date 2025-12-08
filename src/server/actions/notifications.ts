"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { NotificationType, NotificationPriority } from "@prisma/client"
import Pusher from "pusher"

// Initialize Pusher server
const pusher = process.env.PUSHER_APP_ID ? new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true
}) : null

interface CreateNotificationInput {
    userId: string
    title: string
    message: string
    type: NotificationType
    priority?: NotificationPriority
    link?: string
}

export async function createNotification(input: CreateNotificationInput) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId: input.userId,
                title: input.title,
                message: input.message,
                type: input.type,
                priority: input.priority || "NORMAL",
                link: input.link
            }
        })

        // Send real-time notification via Pusher
        if (pusher) {
            try {
                await pusher.trigger(`user-${input.userId}`, "new-notification", {
                    id: notification.id,
                    title: notification.title,
                    message: notification.message,
                    type: notification.type,
                    createdAt: notification.createdAt
                })
            } catch (pusherError) {
                console.error("Pusher notification failed:", pusherError)
            }
        }

        return { notification }
    } catch (error) {
        console.error("Error creating notification:", error)
        return { error: "Failed to create notification" }
    }
}

export async function sendMessageNotification(
    recipientId: string,
    senderName: string,
    messagePreview: string,
    conversationId: string
) {
    return createNotification({
        userId: recipientId,
        title: `New message from ${senderName}`,
        message: messagePreview.length > 50 ? messagePreview.slice(0, 50) + "..." : messagePreview,
        type: "MESSAGE_RECEIVED",
        priority: "NORMAL",
        link: `/patient/chat` // or doctor/chat based on role
    })
}

export async function sendAppointmentNotification(
    userId: string,
    appointmentTitle: string,
    appointmentDate: Date,
    type: "APPOINTMENT_CREATED" | "APPOINTMENT_UPDATED" | "APPOINTMENT_REMINDER"
) {
    const messages = {
        APPOINTMENT_CREATED: `Your appointment "${appointmentTitle}" has been scheduled`,
        APPOINTMENT_UPDATED: `Your appointment "${appointmentTitle}" has been updated`,
        APPOINTMENT_REMINDER: `Reminder: "${appointmentTitle}" is coming up`
    }

    return createNotification({
        userId,
        title: type === "APPOINTMENT_REMINDER" ? "Appointment Reminder" : "Appointment Update",
        message: messages[type],
        type,
        priority: type === "APPOINTMENT_REMINDER" ? "HIGH" : "NORMAL",
        link: "/patient/appointments"
    })
}

export async function sendHealthAlert(
    userId: string,
    alertMessage: string,
    vital: string
) {
    return createNotification({
        userId,
        title: "Health Alert",
        message: alertMessage,
        type: "HEALTH_ALERT",
        priority: "HIGH",
        link: "/patient/health"
    })
}

export async function markNotificationRead(notificationId: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        await prisma.notification.update({
            where: {
                id: notificationId,
                userId: session.user.id
            },
            data: {
                read: true,
                readAt: new Date()
            }
        })
        return { success: true }
    } catch (error) {
        console.error("Error marking notification read:", error)
        return { error: "Failed to mark notification as read" }
    }
}

export async function markAllNotificationsRead() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        await prisma.notification.updateMany({
            where: {
                userId: session.user.id,
                read: false
            },
            data: {
                read: true,
                readAt: new Date()
            }
        })
        return { success: true }
    } catch (error) {
        console.error("Error marking all notifications read:", error)
        return { error: "Failed to mark notifications as read" }
    }
}
