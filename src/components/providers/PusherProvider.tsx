"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { pusher } from "@/lib/pusher"

interface PusherProviderProps {
  children: React.ReactNode
}

export function PusherProvider({ children }: PusherProviderProps) {
  const { data: session } = useSession()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!session?.user || !pusher) return

    const channel = pusher.subscribe(`user-${session.user.id}`)
    
    channel.bind("pusher:subscription_succeeded", () => {
      setIsConnected(true)
    })

    return () => {
      pusher.unsubscribe(`user-${session.user.id}`)
    }
  }, [session])

  return <>{children}</>
}


