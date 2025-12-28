import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { createReportSchema } from "@/lib/validations/report.validation"

export async function GET(req: NextRequest) {
  try {
    console.log("[Reports-GET] Checking authentication...");
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
          console.log("[Reports-GET] Authenticated via Bearer token:", userId);
        } catch (e) {
          console.error("[Reports-GET] Token decode error:", e)
        }
      }
    } else {
      console.log("[Reports-GET] Authenticated via Session:", userId);
    }

    if (!userId) {
      console.warn("[Reports-GET] Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized: No valid session or token found" }, { status: 401 })
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      select: { id: true }
    })

    if (!user) {
      console.warn(`[Reports-GET] User not found in DB: ${userId}`);
      return NextResponse.json({ error: "User not found. Please log in again." }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const type = searchParams.get("type")
    const pregnancyId = searchParams.get("pregnancyId")

    const skip = (page - 1) * limit

    const where: any = {
      userId: userId as string,
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
    console.error("[Reports-GET] Error:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("[Reports-POST] Checking authentication...");
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
          console.log("[Reports-POST] Authenticated via Bearer token:", userId);
        } catch (e) {
          console.error("[Reports-POST] Token decode error:", e);
        }
      }
    } else {
      console.log("[Reports-POST] Authenticated via Session:", userId);
    }

    if (!userId) {
      console.warn("[Reports-POST] Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized: No valid session or token found" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      select: { id: true }
    })

    if (!user) {
      console.warn(`[Reports-POST] User not found in DB: ${userId}`);
      return NextResponse.json({ error: "User not found. Please log in again." }, { status: 401 })
    }

    const body = await req.json()
    console.log("[Reports-POST] Received body:", body)

    // Ensure category is matched or defaulted
    // The mobile app might send a type that isn't a valid category
    const validatedData = createReportSchema.parse(body)

    const report = await prisma.medicalReport.create({
      data: {
        ...validatedData,
        userId: userId as string,
        // Override category to OTHER if it's potentially invalid or missing
        category: (body.category as any) || 'OTHER'
      },
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      console.error("[Reports-POST] Validation Error:", error.errors)
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error("[Reports-POST] Error:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error.message, details: error.stack },
      { status: 500 }
    )
  }
}
