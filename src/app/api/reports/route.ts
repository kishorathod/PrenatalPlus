import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { createReportSchema } from "@/lib/validations/report.validation"

export async function GET(req: NextRequest) {
  try {
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
        } catch (e) {
          console.error("[Reports] Token decode error:", e)
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const type = searchParams.get("type")
    const pregnancyId = searchParams.get("pregnancyId")

    const skip = (page - 1) * limit

    const where: any = {
      userId: userId,
    }

    if (type) {
      where.type = type
    }

    if (pregnancyId) {
      where.pregnancyId = pregnancyId
    }

    const [reports, total] = await Promise.all([
      prisma.medicalReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.medicalReport.count({ where }),
    ])

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching reports:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
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
        } catch (e) { }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createReportSchema.parse(body)

    const report = await prisma.medicalReport.create({
      data: {
        ...validatedData,
        userId: userId,
      },
    })

    return NextResponse.json(report, { status: 201 })
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

    console.error("Error creating report:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
