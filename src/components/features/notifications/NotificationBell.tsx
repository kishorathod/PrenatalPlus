"use client"

import { useEffect, useState } from "react"
import { useNotifications } from "@/hooks/useNotifications"
import { useSession } from "next-auth/react"
import { pusher } from "@/lib/pusher"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { NotificationList } from "./NotificationList"

export function NotificationBell() {
  const { data: session } = useSession()
  const { unreadCount, fetchNotifications } = useNotifications()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Subscribe to real-time notifications via Pusher
  useEffect(() => {
    if (!pusher || !session?.user?.id) return

    const channel = pusher.subscribe(`user-${session.user.id}`)

    channel.bind("new-notification", (data: any) => {
      // Refresh notifications when a new one arrives
      fetchNotifications()

      // Optional: Play notification sound
      if (typeof Audio !== "undefined") {
        try {
          const audio = new Audio("/notification.mp3")
          audio.volume = 0.3
          audio.play().catch(() => { }) // Ignore errors if sound fails
        } catch (e) { }
      }
    })

    return () => {
      pusher?.unsubscribe(`user-${session.user.id}`)
    }
  }, [session?.user?.id, fetchNotifications])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationList onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}


