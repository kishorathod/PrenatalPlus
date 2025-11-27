"use client"

import { useEffect, useState } from "react"
import { useNotifications } from "@/hooks/useNotifications"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { NotificationList } from "./NotificationList"

export function NotificationBell() {
  const { unreadCount, fetchNotifications } = useNotifications()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

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


