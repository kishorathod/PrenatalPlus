import { AppointmentType, AppointmentStatus } from '@prisma/client'

export interface Appointment {
  id: string
  userId: string
  pregnancyId: string | null
  title: string
  description: string | null
  type: AppointmentType
  doctorId: string | null
  doctorName: string | null
  location: string | null
  date: Date
  duration: number
  status: AppointmentStatus
  reminderSent: boolean
  reminderTime: Date | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateAppointmentData {
  title: string
  description?: string
  type: AppointmentType
  doctorId?: string
  doctorName?: string
  location?: string
  date: Date
  duration?: number
  pregnancyId?: string
  reminderTime?: Date
}

export interface UpdateAppointmentData {
  title?: string
  description?: string
  type?: AppointmentType
  doctorId?: string
  doctorName?: string
  location?: string
  date?: Date
  duration?: number
  status?: AppointmentStatus
  notes?: string
}


