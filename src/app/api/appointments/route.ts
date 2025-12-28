import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { createAppointmentSchema } from "@/lib/validations/appointment.validation"
import { triggerAppointmentEvent } from "@/lib/utils/realtime"

export async function GET(req: NextRequest) {
  try {
    console.log("[Appointments-GET] Checking authentication...");
    const session = await auth()
    let userId = session?.user?.id

    if (!userId) {
      const authHeader = req.headers.get("authorization")
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7)
        try {
          const decoded = Buffer.from(token, 'base64').toString('utf-8')
          const userData = JSON.parse(decoded)
          userId = userData.userId || userData.id
          console.log("[Appointments-GET] Authenticated via Bearer token:", userId);
        } catch (e) {
          console.error("[Appointments-GET] Token decode error:", e)
        }
      }
    } else {
      console.log("[Appointments-GET] Authenticated via Session:", userId);
    }

    if (!userId) {
      console.warn("[Appointments-GET] Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized: No valid session or token found" }, { status: 401 })
    }

    // Verify user exists in DB
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      select: { id: true }
    })

    if (!user) {
      console.warn(`[Appointments-GET] User not found in DB: ${userId}`);
      return NextResponse.json({ error: "User not found. Please log in again." }, { status: 401 })
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
    console.error("[Appointments-GET] Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("[Appointments-POST] Checking authentication...");
    const session = await auth()
    let userId = session?.user?.id

    if (!userId) {
      const authHeader = req.headers.get("authorization")
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7)
        try {
          const decoded = Buffer.from(token, 'base64').toString('utf-8')
          const userData = JSON.parse(decoded)
          userId = userData.userId || userData.id
          console.log("[Appointments-POST] Authenticated via Bearer token:", userId);
        } catch (e) {
          console.error("[Appointments-POST] Token decode error:", e);
        }
      }
    } else {
      console.log("[Appointments-POST] Authenticated via Session:", userId);
    }

    if (!userId) {
      console.warn("[Appointments-POST] Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized: No valid session or token found" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      select: { id: true }
    })

    if (!user) {
      console.warn(`[Appointments-POST] User not found in DB: ${userId}`);
      return NextResponse.json({ error: "User not found. Please log in again." }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createAppointmentSchema.parse(body)

    if (validatedData.doctorId === "") {
      validatedData.doctorId = undefined
    }

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

    const activePregnancy = await prisma.pregnancy.findFirst({
      where: {
        userId: userId as string,
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
        doctorId: validatedData.doctorId,
        doctorName: doctorDetails.doctorName || validatedData.doctorName,
        userId: userId as string,
        pregnancyId: activePregnancy?.id,
        doctorAdvice: validatedData.doctorAdvice,
      } as any,
    })

    await triggerAppointmentEvent(userId as string, "created", appointment)

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

    console.error("[Appointments-POST] Error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
