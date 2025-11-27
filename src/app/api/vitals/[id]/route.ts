import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { updateVitalSchema } from "@/lib/validations/vitals.validation"
import { triggerVitalEvent } from "@/lib/utils/realtime"

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

    const vital = await prisma.vitalSign.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!vital) {
      return NextResponse.json(
        { error: "Vital sign not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(vital)
  } catch (error: any) {
    console.error("Error fetching vital:", error)
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

    const vital = await prisma.vitalSign.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!vital) {
      return NextResponse.json(
        { error: "Vital sign not found" },
        { status: 404 }
      )
    }

    const body = await req.json()
    const validatedData = updateVitalSchema.parse(body)

    const updated = await prisma.vitalSign.update({
      where: { id: params.id },
      data: validatedData,
    })

    // Trigger real-time event
    await triggerVitalEvent(session.user.id, "updated", updated)

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

    console.error("Error updating vital:", error)
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

    const vital = await prisma.vitalSign.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!vital) {
      return NextResponse.json(
        { error: "Vital sign not found" },
        { status: 404 }
      )
    }

    await prisma.vitalSign.delete({
      where: { id: params.id },
    })

    // Trigger real-time event
    await triggerVitalEvent(session.user.id, "deleted", { id: params.id })

    return NextResponse.json({
      success: true,
      message: "Vital sign deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting vital:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

