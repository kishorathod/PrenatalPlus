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
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const read = searchParams.get("read")
    const type = searchParams.get("type")

    const skip = (page - 1) * limit

    const where: any = {
      userId: session.user.id,
    }

    if (read !== null) {
      where.read = read === "true"
    }

    if (type) {
      where.type = type
    }

    try {
      const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.notification.count({ where }),
        prisma.notification.count({
          where: {
            userId: session.user.id,
            read: false,
          },
        }),
      ])

      return NextResponse.json({
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    } catch (dbError: any) {
      // If table doesn't exist, return empty data instead of erroring
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        console.warn("Notification table not found, returning empty data")
        return NextResponse.json({
          notifications: [],
          unreadCount: 0,
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        })
      }
      throw dbError
    }
  } catch (error: any) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


