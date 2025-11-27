import { z } from "zod"

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>


