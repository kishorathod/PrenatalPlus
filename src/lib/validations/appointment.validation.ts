import { z } from "zod"
import { AppointmentType, AppointmentStatus } from "@prisma/client"

export const createAppointmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.nativeEnum(AppointmentType),
  doctorId: z.string().optional(),
  doctorName: z.string().optional(),
  location: z.string().optional(),
  date: z.coerce.date(),
  duration: z.number().int().positive().default(30),
  pregnancyId: z.string().optional(),
  reminderTime: z.coerce.date().optional(),
  doctorAdvice: z.string().optional(),
})

export const updateAppointmentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.nativeEnum(AppointmentType).optional(),
  doctorId: z.string().optional(),
  doctorName: z.string().optional(),
  location: z.string().optional(),
  date: z.coerce.date().optional(),
  duration: z.number().int().positive().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  notes: z.string().optional(),
  doctorAdvice: z.string().optional(),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>


