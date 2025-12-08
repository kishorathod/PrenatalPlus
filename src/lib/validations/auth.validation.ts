import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Base registration schema (common fields)
const baseRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
})

// Patient-specific registration schema
export const patientRegisterSchema = baseRegisterSchema.extend({
  phone: z.string().length(10, "Phone number must be exactly 10 digits").regex(/^\d+$/, "Phone must contain only numbers"),
  dateOfBirth: z
    .union([z.date(), z.string()])
    .transform((val) => {
      if (!val) return undefined
      if (val instanceof Date) return val
      if (typeof val === "string") {
        const date = new Date(val)
        return isNaN(date.getTime()) ? undefined : date
      }
      return undefined
    }),
  expectedDueDate: z
    .union([z.date(), z.string()])
    .optional()
    .transform((val) => {
      if (!val) return undefined
      if (val instanceof Date) return val
      if (typeof val === "string") {
        const date = new Date(val)
        return isNaN(date.getTime()) ? undefined : date
      }
      return undefined
    }),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().length(10, "Phone number must be exactly 10 digits").regex(/^\d+$/, "Phone must contain only numbers").optional().or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Doctor-specific registration schema
export const doctorRegisterSchema = baseRegisterSchema.extend({
  phone: z.string().length(10, "Phone number must be exactly 10 digits").regex(/^\d+$/, "Phone must contain only numbers"),
  medicalLicenseNumber: z.string().min(5, "Medical license number is required"),
  specialization: z.string().min(2, "Specialization is required"),
  hospitalClinic: z.string().min(2, "Hospital/Clinic name is required"),
  yearsOfExperience: z.coerce.number().min(0, "Years of experience must be 0 or greater").max(70, "Invalid years of experience"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Admin-specific registration schema
export const adminRegisterSchema = baseRegisterSchema.extend({
  adminRole: z.enum(["SUPER_ADMIN", "DEPARTMENT_ADMIN", "SUPPORT_ADMIN"], {
    errorMap: () => ({ message: "Please select a valid admin role" }),
  }),
  department: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Legacy schema for backward compatibility
export const registerSchema = patientRegisterSchema

export type LoginInput = z.infer<typeof loginSchema>
export type PatientRegisterInput = z.infer<typeof patientRegisterSchema>
export type DoctorRegisterInput = z.infer<typeof doctorRegisterSchema>
export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>
export type RegisterInput = z.infer<typeof registerSchema>

