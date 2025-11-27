import { z } from "zod"
import { ReportType } from "@prisma/client"

export const createReportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.nativeEnum(ReportType),
  description: z.string().optional(),
  fileUrl: z.string().url("Invalid file URL"),
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.number().int().positive("File size must be positive"),
  mimeType: z.string().min(1, "MIME type is required"),
  reportDate: z.preprocess((arg) => {
    if (typeof arg === "string" && arg === "") return undefined
    return arg
  }, z.coerce.date().optional()),
  doctorName: z.string().optional(),
  clinicName: z.string().optional(),
  pregnancyId: z.string().optional(),
})

export type CreateReportInput = z.infer<typeof createReportSchema>

export const reportFormSchema = createReportSchema.omit({
  fileUrl: true,
  fileName: true,
  fileSize: true,
  mimeType: true,
})

export type ReportFormInput = z.infer<typeof reportFormSchema>


