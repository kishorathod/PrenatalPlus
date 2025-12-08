"use client"

import { Notification } from "@/types/notification.types"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Calendar, FileText, Heart, Bell, MessageSquare, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NotificationType } from "@prisma/client"

interface NotificationItemProps {
  notification: Notification
  onRead: () => void
  onClose?: () => void
}

const typeIcons: Record<NotificationType, typeof Bell> = {
  APPOINTMENT_REMINDER: Calendar,
  APPOINTMENT_CREATED: Calendar,
  APPOINTMENT_UPDATED: Calendar,
  VITAL_REMINDER: Heart,
  REPORT_UPLOADED: FileText,
  SYSTEM_ALERT: Bell,
  GENERAL: Bell,
  MESSAGE_RECEIVED: MessageSquare,
  HEALTH_ALERT: AlertTriangle,
}

export function NotificationItem({ notification, onRead, onClose }: NotificationItemProps) {
  const Icon = typeIcons[notification.type] || Bell
  const isUnread = !notification.read

  const handleClick = () => {
    if (isUnread) {
      onRead()
    }
    if (notification.link) {
      onClose?.()
    }
  }

  return (
    <div
      className={cn(
        "p-4 hover:bg-accent transition-colors cursor-pointer",
        isUnread && "bg-accent/50"
      )}
      onClick={handleClick}
    >
      {notification.link ? (
        <Link href={notification.link} className="block">
          <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{notification.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {format(new Date(notification.createdAt), "PPP 'at' p")}
              </p>
            </div>
            {isUnread && (
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
            )}
          </div>
        </Link>
      ) : (
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{notification.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {format(new Date(notification.createdAt), "PPP 'at' p")}
            </p>
          </div>
          {isUnread && (
            <div className="h-2 w-2 rounded-full bg-primary mt-2" />
          )}
        </div>
      )}
    </div>
  )
}


