import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { pusherServer } from "@/lib/pusher-server"

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
    const { socket_id, channel_name } = body

    const auth = pusherServer.authorizeChannel(socket_id, channel_name, {
      user_id: session.user.id,
      user_info: {
        name: session.user.name,
        email: session.user.email,
      },
    })

    return NextResponse.json(auth)
  } catch (error: any) {
    console.error("Pusher auth error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


