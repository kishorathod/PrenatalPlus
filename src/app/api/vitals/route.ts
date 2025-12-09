import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { createVitalSchema } from "@/lib/validations/vitals.validation"
import { triggerVitalEvent } from "@/lib/utils/realtime"

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
    const type = searchParams.get("type")
    const pregnancyId = searchParams.get("pregnancyId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const skip = (page - 1) * limit

    const where: any = {
      userId: session.user.id,
    }

    if (type) {
      where.type = type
    }

    if (pregnancyId) {
      where.pregnancyId = pregnancyId
    }

    if (startDate || endDate) {
      where.recordedAt = {}
      if (startDate) {
        where.recordedAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.recordedAt.lte = new Date(endDate)
      }
    }

    const [vitals, total] = await Promise.all([
      prisma.vitalReading.findMany({
        where,
        skip,
        take: limit,
        orderBy: { recordedAt: "desc" },
      }),
      prisma.vitalReading.count({ where }),
    ])

    return NextResponse.json({
      vitals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching vitals:", error)
    return NextResponse.json(
      { error: "Internal server error" },
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
    const validatedData = createVitalSchema.parse(body)

    const vital = await prisma.vitalReading.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        recordedAt: validatedData.recordedAt || new Date(),
      },
    })

    // Trigger real-time event
    await triggerVitalEvent(session.user.id, "added", vital)

    return NextResponse.json(vital, { status: 201 })
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

    console.error("Error creating vital:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

