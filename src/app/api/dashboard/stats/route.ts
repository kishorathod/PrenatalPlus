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

    const userId = session.user.id
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6))

    const [
      totalAppointments,
      upcomingAppointments,
      totalVitals,
      totalReports,
      activePregnancies,
      recentAppointments,
      recentVitals,
    ] = await Promise.all([
      // Total appointments
      prisma.appointment.count({
        where: { userId },
      }),
      // Upcoming appointments (next 7 days)
      prisma.appointment.count({
        where: {
          userId,
          date: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          status: {
            in: ["SCHEDULED", "CONFIRMED"],
          },
        },
      }),
      // Total vitals
      prisma.vitalSign.count({
        where: { userId },
      }),
      // Total reports
      prisma.medicalReport.count({
        where: { userId },
      }),
      // Active pregnancies
      prisma.pregnancy.count({
        where: {
          userId,
          status: "ACTIVE",
        },
      }),
      // Recent appointments (last 5)
      prisma.appointment.findMany({
        where: { userId },
        take: 5,
        orderBy: { date: "desc" },
        select: {
          id: true,
          title: true,
          date: true,
          status: true,
        },
      }),
      // Recent vitals (last 5)
      prisma.vitalSign.findMany({
        where: { userId },
        take: 5,
        orderBy: { recordedAt: "desc" },
        select: {
          id: true,
          type: true,
          value: true,
          unit: true,
          recordedAt: true,
        },
      }),
    ])

    return NextResponse.json({
      stats: {
        totalAppointments,
        upcomingAppointments,
        totalVitals,
        totalReports,
        activePregnancies,
      },
      recent: {
        appointments: recentAppointments,
        vitals: recentVitals,
      },
    })
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


