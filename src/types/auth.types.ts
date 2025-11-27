import { UserRole } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  dateOfBirth?: Date
}


