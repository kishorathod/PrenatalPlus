import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { createAppointmentSchema } from "@/lib/validations/appointment.validation"
import { triggerAppointmentEvent } from "@/lib/utils/realtime"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const skip = (page - 1) * limit

    const where: any = {
      userId: userId,
    }

    if (status) {
      where.status = status
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        const d = new Date(startDate)
        if (!isNaN(d.getTime())) {
          where.date.gte = d
        }
      }
      if (endDate) {
        const d = new Date(endDate)
        if (!isNaN(d.getTime())) {
          where.date.lte = d
        }
      }
      // If no valid dates were added, remove the empty date filter
      if (Object.keys(where.date).length === 0) {
        delete where.date
      }
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "asc" },
      }),
      prisma.appointment.count({ where }),
    ])

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = createAppointmentSchema.parse(body)

    // Clean up doctorId - if it's an empty string, set to null/undefined
    if (validatedData.doctorId === "") {
      validatedData.doctorId = undefined
    }

    // If doctorId is provided, fetch doctor details to populate fallback fields
    let doctorDetails: { doctorName?: string } = {}
    if (validatedData.doctorId) {
      const doctor = await prisma.user.findUnique({
        where: { id: validatedData.doctorId },
        select: { name: true }
      })
      if (doctor) {
        doctorDetails = {
          doctorName: doctor.name || undefined,
        }
      }
    }

    // Check if there's an active pregnancy to link
    const activePregnancy = await prisma.pregnancy.findFirst({
      where: {
        userId: userId,
        status: "ACTIVE"
      }
    })

    const appointment = await prisma.appointment.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        date: validatedData.date,
        duration: validatedData.duration,
        location: validatedData.location,
        // Include doctorId if provided
        doctorId: validatedData.doctorId,
        // Use the fetched doctor details or the ones provided in the form
        doctorName: doctorDetails.doctorName || validatedData.doctorName,
        userId: userId,
        pregnancyId: activePregnancy?.id,
        doctorAdvice: validatedData.doctorAdvice,
      } as any,
    })

    // Trigger real-time event
    await triggerAppointmentEvent(session.user.id, "created", appointment)

    return NextResponse.json(appointment, { status: 201 })
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

    console.error("Error creating appointment:", error)
    // Return the actual error message for debugging (in development)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

