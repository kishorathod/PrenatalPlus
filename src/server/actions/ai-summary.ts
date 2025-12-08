"use server"

import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { generateAIResponse } from "@/lib/gemini"
import { subDays, format } from "date-fns"

export async function generateWeeklySummary() {
    try {
        const session = await auth()
        if (!session?.user) {
            return { error: "Unauthorized" }
        }

        const userId = session.user.id
        const pregnancy = await prisma.pregnancy.findFirst({
            where: { userId, status: "ACTIVE" }
        })

        if (!pregnancy) {
            return { error: "No active pregnancy found" }
        }

        // 1. Fetch data from the last 7 days
        const startDate = subDays(new Date(), 7)

        const recentVitals = await prisma.vitalReading.findMany({
            where: {
                userId,
                recordedAt: { gte: startDate }
            },
            orderBy: { recordedAt: "asc" }
        })

        const recentAppointments = await prisma.appointment.findMany({
            where: {
                userId,
                date: { gte: startDate } // Upcoming or recent
            },
            orderBy: { date: "asc" },
            include: { doctor: { select: { name: true } } }
        })

        // 2. Construct Prompt
        const vitalsText = recentVitals.map(v =>
            `- ${format(v.recordedAt, "MMM d")}: BP ${v.systolic}/${v.diastolic}, Weight ${v.weight}kg, HR ${v.heartRate}`
        ).join("\n")

        const appointmentsText = recentAppointments.map(a =>
            `- ${format(a.date, "MMM d")}: ${a.type} with ${a.doctor?.name || "Doctor"} (${a.status})`
        ).join("\n")

        const prompt = `
        Time: ${new Date().toLocaleDateString()}
        Patient Pregnancy Week: ${pregnancy.currentWeek}
        
        Recent Vitals (Last 7 Days):
        ${vitalsText || "No vitals recorded this week."}
        
        Recent/Upcoming Appointments:
        ${appointmentsText || "No appointments this week."}
        
        TASK:
        Generate a hyper-concise weekly health glance.
        1. Output EXACTLY 2-3 short bullet points.
        2. Max 10 words per bullet.
        3. Tone: Calm, reassuring, professional but warm.
        4. Focus on: "Vitals stable", "Next appt: [Date]", or a quick specific tip.
        5. NO introductory text. NO closing. Just the bullets.
        
        Example format:
        - Blood pressure is perfect this week.
        - Remember your scan on Friday!
        - Baby is listening—talk to them today.
        `

        // 3. Call AI
        const response = await generateAIResponse([], prompt)

        if (response.error) {
            console.error("AI Summary Error:", response.error)
            return { error: "Failed to generate summary. Please try again." }
        }

        return { summary: response.text }

    } catch (error) {
        console.error("Error generating weekly summary:", error)
        return { error: "Internal server error" }
    }
}
