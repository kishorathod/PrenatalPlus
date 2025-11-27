import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateNotificationPreferencesSchema = z.object({
  emailEnabled: z.boolean().optional(),
  emailAppointmentReminders: z.boolean().optional(),
  emailVitalReminders: z.boolean().optional(),
  emailReportAlerts: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  pushAppointmentReminders: z.boolean().optional(),
  pushVitalReminders: z.boolean().optional(),
  pushReportAlerts: z.boolean().optional(),
  appointmentReminderHours: z.number().int().positive().optional(),
  vitalReminderDays: z.number().int().positive().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId: session.user.id },
    })

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: {
          userId: session.user.id,
        },
      })
    }

    return NextResponse.json(preferences)
  } catch (error: any) {
    console.error("Error fetching notification preferences:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = updateNotificationPreferencesSchema.parse(body)

    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId: session.user.id },
    })

    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: {
          userId: session.user.id,
          ...validatedData,
        },
      })
    } else {
      preferences = await prisma.notificationPreference.update({
        where: { userId: session.user.id },
        data: validatedData,
      })
    }

    return NextResponse.json(preferences)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error("Error updating notification preferences:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


