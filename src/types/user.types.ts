import { UserRole } from '@prisma/client'

export interface User {
  id: string
  email: string
  emailVerified: Date | null
  name: string | null
  role: UserRole
  phone: string | null
  dateOfBirth: Date | null
  avatar: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  country: string | null
  createdAt: Date
  updatedAt: Date
}

export interface UpdateUserData {
  name?: string
  phone?: string
  dateOfBirth?: Date
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}


