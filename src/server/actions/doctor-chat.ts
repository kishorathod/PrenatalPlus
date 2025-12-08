"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"

export async function getDoctorConversations() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        const conversations = await prisma.conversation.findMany({
            where: {
                doctorId: session.user.id
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        email: true
                    }
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        content: true,
                        createdAt: true,
                        senderId: true
                    }
                }
            },
            orderBy: {
                lastMessageAt: 'desc'
            }
        })

        // Add unread count for each conversation
        const conversationsWithUnread = await Promise.all(
            conversations.map(async (conv) => {
                const unreadCount = await prisma.message.count({
                    where: {
                        conversationId: conv.id,
                        senderId: { not: session.user.id },
                        read: false
                    }
                })
                return { ...conv, unreadCount }
            })
        )

        return { conversations: conversationsWithUnread }
    } catch (error) {
        console.error("Error fetching doctor conversations:", error)
        return { error: "Failed to fetch conversations" }
    }
}

export async function getDoctorConversation(patientId: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        const conversation = await prisma.conversation.findFirst({
            where: {
                doctorId: session.user.id,
                patientId: patientId
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        email: true
                    }
                }
            }
        })

        if (!conversation) {
            return { error: "Conversation not found" }
        }

        return { conversation }
    } catch (error) {
        console.error("Error fetching conversation:", error)
        return { error: "Failed to fetch conversation" }
    }
}

export async function markMessagesAsRead(conversationId: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        await prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: session.user.id },
                read: false
            },
            data: {
                read: true
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Error marking messages as read:", error)
        return { error: "Failed to mark messages as read" }
    }
}
