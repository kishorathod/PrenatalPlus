import { z } from "zod"

export const createVitalSchema = z.object({
  bloodPressureSystolic: z.number().positive().optional(),
  bloodPressureDiastolic: z.number().positive().optional(),
  heartRate: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  temperature: z.number().positive().optional(),
  glucose: z.number().positive().optional(),
  spo2: z.number().int().min(0).max(100).optional(),
  fetalMovement: z.number().int().positive().optional(),
  week: z.number().int().positive().optional(),
  notes: z.string().optional(),
  pregnancyId: z.string().optional(),
  recordedAt: z.coerce.date().optional(),
})

export const updateVitalSchema = z.object({
  bloodPressureSystolic: z.number().positive().optional(),
  bloodPressureDiastolic: z.number().positive().optional(),
  heartRate: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  temperature: z.number().positive().optional(),
  glucose: z.number().positive().optional(),
  spo2: z.number().int().min(0).max(100).optional(),
  fetalMovement: z.number().int().positive().optional(),
  week: z.number().int().positive().optional(),
  notes: z.string().optional(),
  recordedAt: z.coerce.date().optional(),
})

export type CreateVitalInput = z.infer<typeof createVitalSchema>
export type UpdateVitalInput = z.infer<typeof updateVitalSchema>


