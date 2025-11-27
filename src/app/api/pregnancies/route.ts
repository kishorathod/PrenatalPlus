import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createPregnancySchema = z.object({
  startDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  bloodType: z.string().optional(),
  rhFactor: z.string().optional(),
  height: z.number().positive().optional(),
  prePregnancyWeight: z.number().positive().optional(),
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

    const pregnancies = await prisma.pregnancy.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: { startDate: "desc" },
      include: {
        _count: {
          select: {
            appointments: true,
            vitals: true,
            reports: true,
          },
        },
      },
    })

    return NextResponse.json({ pregnancies })
  } catch (error: any) {
    console.error("Error fetching pregnancies:", error)
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
    const validatedData = createPregnancySchema.parse(body)

    // Calculate current week
    const today = new Date()
    const startDate = new Date(validatedData.startDate)
    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const currentWeek = Math.floor(daysDiff / 7)

    const pregnancy = await prisma.pregnancy.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        currentWeek: Math.max(0, currentWeek),
      },
    })

    return NextResponse.json(pregnancy, { status: 201 })
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

    console.error("Error creating pregnancy:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


