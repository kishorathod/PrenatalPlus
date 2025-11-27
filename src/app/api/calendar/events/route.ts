import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"

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
    const startDate = searchParams.get("start")
    const endDate = searchParams.get("end")

    const where: any = {
      userId: session.user.id,
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      select: {
        id: true,
        title: true,
        date: true,
        duration: true,
        type: true,
        status: true,
        location: true,
        doctorName: true,
      },
      orderBy: { date: "asc" },
    })

    // Format for calendar (FullCalendar format)
    const events = appointments.map((apt) => ({
      id: apt.id,
      title: apt.title,
      start: apt.date,
      end: new Date(new Date(apt.date).getTime() + apt.duration * 60000),
      extendedProps: {
        type: apt.type,
        status: apt.status,
        location: apt.location,
        doctorName: apt.doctorName,
      },
    }))

    return NextResponse.json({ events })
  } catch (error: any) {
    console.error("Error fetching calendar events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


