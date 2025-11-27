import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updatePregnancySchema = z.object({
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "TERMINATED"]).optional(),
  bloodType: z.string().optional(),
  rhFactor: z.string().optional(),
  height: z.number().positive().optional(),
  prePregnancyWeight: z.number().positive().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const pregnancy = await prisma.pregnancy.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        appointments: {
          take: 5,
          orderBy: { date: "desc" },
        },
        vitals: {
          take: 10,
          orderBy: { recordedAt: "desc" },
        },
        reports: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!pregnancy) {
      return NextResponse.json(
        { error: "Pregnancy not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(pregnancy)
  } catch (error: any) {
    console.error("Error fetching pregnancy:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const pregnancy = await prisma.pregnancy.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!pregnancy) {
      return NextResponse.json(
        { error: "Pregnancy not found" },
        { status: 404 }
      )
    }

    const body = await req.json()
    const validatedData = updatePregnancySchema.parse(body)

    // Recalculate current week if startDate changed
    let currentWeek = pregnancy.currentWeek
    if (validatedData.startDate) {
      const today = new Date()
      const startDate = new Date(validatedData.startDate)
      const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      currentWeek = Math.max(0, Math.floor(daysDiff / 7))
    }

    const updated = await prisma.pregnancy.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        currentWeek,
      },
    })

    return NextResponse.json(updated)
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

    console.error("Error updating pregnancy:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const pregnancy = await prisma.pregnancy.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!pregnancy) {
      return NextResponse.json(
        { error: "Pregnancy not found" },
        { status: 404 }
      )
    }

    await prisma.pregnancy.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: "Pregnancy deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting pregnancy:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


