import { NotificationType, NotificationPriority } from '@prisma/client'

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  link: string | null
  action: string | null
  read: boolean
  readAt: Date | null
  createdAt: Date
}

export interface CreateNotificationData {
  userId: string
  title: string
  message: string
  type: NotificationType
  priority?: NotificationPriority
  link?: string
  action?: string
}


