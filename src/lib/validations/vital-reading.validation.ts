import { z } from "zod"

export const createVitalReadingSchema = z.object({
    // Blood Pressure
    systolic: z.number().int().min(50).max(250).optional(),
    diastolic: z.number().int().min(30).max(150).optional(),

    // Other vitals
    heartRate: z.number().int().min(30).max(200).optional(),
    weight: z.number().min(30).max(200).optional(),
    temperature: z.number().min(35).max(42).optional(),
    glucose: z.number().min(20).max(600).optional(),
    spo2: z.number().int().min(70).max(100).optional(),
    fetalMovement: z.number().int().min(0).max(100).optional(),

    // Metadata
    week: z.number().int().min(1).max(42).optional(),
    notes: z.string().max(1000).optional(),
    recordedAt: z.coerce.date().optional(),
    pregnancyId: z.string().optional(),
}).refine(
    (data) => {
        // At least one vital must be provided
        return (
            data.systolic !== undefined ||
            data.diastolic !== undefined ||
            data.heartRate !== undefined ||
            data.weight !== undefined ||
            data.temperature !== undefined ||
            data.glucose !== undefined ||
            data.spo2 !== undefined ||
            data.fetalMovement !== undefined
        )
    },
    {
        message: "At least one vital measurement must be provided",
    }
).refine(
    (data) => {
        // If systolic is provided, diastolic must be too (and vice versa)
        if (data.systolic !== undefined || data.diastolic !== undefined) {
            return data.systolic !== undefined && data.diastolic !== undefined
        }
        return true
    },
    {
        message: "Both systolic and diastolic blood pressure must be provided together",
    }
)

export const updateVitalReadingSchema = createVitalReadingSchema.partial()

export const acknowledgeAlertSchema = z.object({
    acknowledged: z.boolean(),
})

export type CreateVitalReadingInput = z.infer<typeof createVitalReadingSchema>
export type UpdateVitalReadingInput = z.infer<typeof updateVitalReadingSchema>
