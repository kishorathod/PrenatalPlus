import { z } from "zod"

export const createPregnancySchema = z.object({
    startDate: z.coerce.date().refine(
        (date) => date <= new Date(),
        "Start date (LMP) cannot be in the future"
    ),
    dueDate: z.coerce.date().refine(
        (date) => date >= new Date(),
        "Due date must be in the future"
    ),
    bloodType: z.string().optional(),
    rhFactor: z.enum(["Positive", "Negative", "positive", "negative", "+", "-"]).optional(),
    height: z.number().positive().optional(),
    prePregnancyWeight: z.number().positive().optional(),
}).refine(
    (data) => {
        // Ensure due date is after start date
        return data.dueDate > data.startDate
    },
    {
        message: "Due date must be after start date (LMP)",
        path: ["dueDate"],
    }
)

export const updatePregnancySchema = z.object({
    startDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "TERMINATED"]).optional(),
    riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    bloodType: z.string().optional(),
    rhFactor: z.enum(["Positive", "Negative", "positive", "negative", "+", "-"]).optional(),
    height: z.number().positive().optional(),
    prePregnancyWeight: z.number().positive().optional(),
})

export type CreatePregnancyInput = z.infer<typeof createPregnancySchema>
export type UpdatePregnancyInput = z.infer<typeof updatePregnancySchema>
