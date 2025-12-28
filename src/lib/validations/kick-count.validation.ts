import { z } from "zod"

export const createKickCountSchema = z.object({
    count: z.number().int().min(1),
    duration: z.number().int().min(1), // duration in minutes
    pregnancyId: z.string().min(1),
    week: z.number().int().min(1).max(42).optional(),
    notes: z.string().max(1000).optional(),
    startedAt: z.coerce.date(),
    completedAt: z.coerce.date().optional(),
})

export type CreateKickCountInput = z.infer<typeof createKickCountSchema>
