"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher-server"
import { revalidatePath } from "next/cache"

export async function getConversation() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        // Find assigned doctor
        const assignment = await prisma.patientAssignment.findFirst({
            where: {
                patientId: session.user.id,
                status: "ACTIVE"
            },
            include: {
                doctor: true
            }
        })

        if (!assignment) {
            return { error: "No assigned doctor found" }
        }

        // Find or create conversation
        let conversation = await prisma.conversation.findUnique({
            where: {
                patientId_doctorId: {
                    patientId: session.user.id,
                    doctorId: assignment.doctorId
                }
            },
            include: {
                doctor: {
                    select: {
                        name: true,
                        avatar: true,
                        specialization: true
                    }
                }
            }
        })

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    patientId: session.user.id,
                    doctorId: assignment.doctorId
                },
                include: {
                    doctor: {
                        select: {
                            name: true,
                            avatar: true,
                            specialization: true
                        }
                    }
                }
            })
        }

        return { conversation }
    } catch (error) {
        console.error("Error fetching conversation:", error)
        return { error: "Failed to fetch conversation" }
    }
}

export async function getMessages(conversationId: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId
            },
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        role: true
                    }
                }
            }
        })

        return { messages }
    } catch (error) {
        console.error("Error fetching messages:", error)
        return { error: "Failed to fetch messages" }
    }
}

export async function sendMessage(conversationId: string, content: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        // Get conversation details to find recipient
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                patient: { select: { id: true, name: true } },
                doctor: { select: { id: true, name: true } }
            }
        })

        if (!conversation) {
            return { error: "Conversation not found" }
        }

        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId: session.user.id,
                content
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        role: true
                    }
                }
            }
        })

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { lastMessageAt: new Date() }
        })

        // Trigger Pusher event
        await pusherServer.trigger(
            `conversation-${conversationId}`,
            "new-message",
            message
        )

        // Send notification to recipient
        const recipientId = session.user.id === conversation.patientId
            ? conversation.doctorId
            : conversation.patientId

        const senderName = session.user.name || "Someone"

        // Import and call notification function
        const { sendMessageNotification } = await import("./notifications")
        await sendMessageNotification(
            recipientId,
            senderName,
            content,
            conversationId
        )

        return { message }
    } catch (error) {
        console.error("Error sending message:", error)
        return { error: "Failed to send message" }
    }
}
