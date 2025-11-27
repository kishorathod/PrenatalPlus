import { VitalType } from '@prisma/client'

export interface VitalSign {
  id: string
  userId: string
  pregnancyId: string | null
  type: VitalType
  value: number
  unit: string
  week: number | null
  notes: string | null
  recordedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateVitalData {
  type: VitalType
  value: number
  unit: string
  week?: number
  notes?: string
  pregnancyId?: string
  recordedAt?: Date
}

export interface UpdateVitalData {
  value?: number
  unit?: string
  week?: number
  notes?: string
  recordedAt?: Date
}


