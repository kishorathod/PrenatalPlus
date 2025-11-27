"use client"

import { useNotifications } from "@/hooks/useNotifications"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NotificationItem } from "./NotificationItem"
import { Loading } from "@/components/ui/loading"

interface NotificationListProps {
  onClose?: () => void
}

export function NotificationList({ onClose }: NotificationListProps) {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications()

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              markAllAsRead()
            }}
          >
            Mark all read
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loading size="sm" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No notifications
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={() => markAsRead(notification.id)}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}


