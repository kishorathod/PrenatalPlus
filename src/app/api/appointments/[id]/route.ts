import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { updateAppointmentSchema } from "@/lib/validations/appointment.validation"
import { triggerAppointmentEvent } from "@/lib/utils/realtime"

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

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(appointment)
  } catch (error: any) {
    console.error("Error fetching appointment:", error)
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

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    const body = await req.json()
    const validatedData = updateAppointmentSchema.parse(body)

    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: validatedData,
    })

    // Trigger real-time event
    await triggerAppointmentEvent(session.user.id, "updated", updated)

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

    console.error("Error updating appointment:", error)
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

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    await prisma.appointment.delete({
      where: { id: params.id },
    })

    // Trigger real-time event
    await triggerAppointmentEvent(session.user.id, "deleted", { id: params.id })

    return NextResponse.json({
      success: true,
      message: "Appointment deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

