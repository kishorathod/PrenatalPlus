import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"

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

    const notification = await prisma.notification.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      )
    }

    const body = await req.json()
    const { read } = body

    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: {
        read: read === true,
        readAt: read === true ? new Date() : null,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Error updating notification:", error)
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

    const notification = await prisma.notification.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      )
    }

    await prisma.notification.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Notification deleted" })
  } catch (error: any) {
    console.error("Error deleting notification:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


