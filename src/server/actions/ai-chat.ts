"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { generateAIResponse } from "@/lib/gemini"

const EMERGENCY_KEYWORDS = [
    "bleeding", "severe pain", "contraction", "water broke",
    "dizzy", "faint", "shortness of breath", "vision", "headache",
    "fever", "chest pain", "swelling", "movement"
]

const EMERGENCY_RESPONSE = `⚠️ **This sounds like it could be important.**

As an AI, I cannot evaluate medical symptoms. Please:
1. Contact your doctor immediately.
2. Or go to the nearest emergency room if you feel unsafe.

Do not wait for an app response for medical emergencies.`

async function checkAuth() {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Unauthorized")
    }
    return session
}

export async function getOrCreateAIChatSession() {
    try {
        const session = await checkAuth()

        let chatSession = await prisma.aIChatSession.findFirst({
            where: {
                userId: session.user.id!,
                isActive: true
            },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" }
                }
            }
        })

        if (!chatSession) {
            chatSession = await prisma.aIChatSession.create({
                data: {
                    userId: session.user.id!,
                },
                include: {
                    messages: true
                }
            })
        }

        return { session: chatSession, error: null }
    } catch (error) {
        console.error("Error creating/fetching chat session:", error)
        return { session: null, error: "Failed to start chat. Please try logging in again." }
    }
}

export async function sendAIMessage(sessionId: string, content: string) {
    await checkAuth()

    try {
        // 1. Save User Message
        const userMessage = await prisma.aIMessage.create({
            data: {
                sessionId,
                role: "USER",
                content
            }
        })

        // 2. Safety Check (Keyword based override)
        const lowerContent = content.toLowerCase()
        const isEmergency = EMERGENCY_KEYWORDS.some(k => lowerContent.includes(k))

        let aiResponseText = ""

        if (isEmergency) {
            aiResponseText = EMERGENCY_RESPONSE
        } else {
            // 3. Generate AI Response
            // Fetch history for context (last 10 messages)
            const previousMessages = await prisma.aIMessage.findMany({
                where: { sessionId },
                orderBy: { createdAt: "desc" },
                take: 10,
                skip: 1 // Skip the one we just added
            })

            const history = previousMessages.reverse().map(msg => ({
                role: msg.role === "USER" ? "user" as const : "model" as const,
                parts: msg.content
            }))

            const aiResult = await generateAIResponse(history, content)

            if (aiResult.error) {
                return { error: aiResult.error }
            }
            aiResponseText = aiResult.text || "I apologize, I couldn't generate a response."
        }

        // 4. Save AI Response
        const aiMessage = await prisma.aIMessage.create({
            data: {
                sessionId,
                role: "ASSISTANT",
                content: aiResponseText
            }
        })

        // 5. Update session updated at
        await prisma.aIChatSession.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() }
        })

        revalidatePath("/patient/chat/ai")
        return { success: true, message: aiMessage }

    } catch (error) {
        console.error("Error sending message:", error)
        return { error: "Failed to process message" }
    }
}

export async function clearChatHistory(sessionId: string) {
    const session = await checkAuth()

    try {
        await prisma.aIChatSession.update({
            where: {
                id: sessionId,
                userId: session.user.id!
            },
            data: {
                isActive: false
            }
        })

        revalidatePath("/patient/chat/ai")
        return { success: true }
    } catch (error) {
        return { error: "Failed to clear history" }
    }
}
