"use client"

import { useCallback } from "react"
import { useNotificationStore } from "@/store/useNotificationStore"

export function useNotifications() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    setNotifications,
    setLoading,
    setError,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadNotifications,
  } = useNotificationStore()

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/notifications")
      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch notifications")
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setNotifications])

  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark notification as read")
      }

      markAsRead(id)
    } catch (err: any) {
      setError(err.message || "Failed to mark notification as read")
    }
  }, [markAsRead, setError])

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      // Mark all unread notifications
      const unread = getUnreadNotifications()
      await Promise.all(
        unread.map((notification) => markNotificationAsRead(notification.id))
      )
      markAllAsRead()
    } catch (err: any) {
      setError(err.message || "Failed to mark all as read")
    }
  }, [getUnreadNotifications, markNotificationAsRead, markAllAsRead, setError])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    deleteNotification,
    getUnreadNotifications,
  }
}


