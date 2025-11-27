import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"

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

    const report = await prisma.medicalReport.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(report)
  } catch (error: any) {
    console.error("Error fetching report:", error)
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

    const report = await prisma.medicalReport.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      )
    }

    await prisma.medicalReport.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: "Report deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting report:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


