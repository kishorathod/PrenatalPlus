import { create } from "zustand"
import { Notification } from "@/types/notification.types"

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  
  // Actions
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // Getters
  getUnreadNotifications: () => Notification[]
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
  
  addNotification: (notification) =>
    set((state) => {
      const newNotifications = [notification, ...state.notifications]
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      }
    }),
  
  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true, readAt: new Date() } : n
      )
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      }
    }),
  
  markAllAsRead: () =>
    set((state) => {
      const updated = state.notifications.map((n) => ({
        ...n,
        read: true,
        readAt: n.readAt || new Date(),
      }))
      return {
        notifications: updated,
        unreadCount: 0,
      }
    }),
  
  deleteNotification: (id) =>
    set((state) => {
      const filtered = state.notifications.filter((n) => n.id !== id)
      return {
        notifications: filtered,
        unreadCount: filtered.filter((n) => !n.read).length,
      }
    }),
  
  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  getUnreadNotifications: () => {
    return get().notifications.filter((n) => !n.read)
  },
}))


