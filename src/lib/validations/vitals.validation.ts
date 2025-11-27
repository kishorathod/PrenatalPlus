import { z } from "zod"
import { VitalType } from "@prisma/client"

export const createVitalSchema = z.object({
  type: z.nativeEnum(VitalType),
  value: z.number().positive("Value must be positive"),
  unit: z.string().min(1, "Unit is required"),
  week: z.number().int().positive().optional(),
  notes: z.string().optional(),
  pregnancyId: z.string().optional(),
  recordedAt: z.coerce.date().optional(),
})

export const updateVitalSchema = z.object({
  value: z.number().positive().optional(),
  unit: z.string().min(1).optional(),
  week: z.number().int().positive().optional(),
  notes: z.string().optional(),
  recordedAt: z.coerce.date().optional(),
})

export type CreateVitalInput = z.infer<typeof createVitalSchema>
export type UpdateVitalInput = z.infer<typeof updateVitalSchema>


