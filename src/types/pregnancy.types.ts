import { PregnancyStatus, RiskLevel } from '@prisma/client'

export interface Pregnancy {
    id: string
    userId: string
    startDate: Date
    dueDate: Date
    currentWeek: number
    status: PregnancyStatus
    riskLevel: RiskLevel | null
    bloodType: string | null
    rhFactor: string | null
    height: number | null
    prePregnancyWeight: number | null
    createdAt: Date
    updatedAt: Date
}

export interface CreatePregnancyData {
    startDate: Date
    dueDate: Date
    bloodType?: string
    rhFactor?: string
    height?: number
    prePregnancyWeight?: number
}

export interface UpdatePregnancyData {
    startDate?: Date
    dueDate?: Date
    status?: PregnancyStatus
    riskLevel?: RiskLevel
    bloodType?: string
    rhFactor?: string
    height?: number
    prePregnancyWeight?: number
}

export interface PregnancyWithCounts extends Pregnancy {
    _count: {
        appointments: number
        vitals: number
        reports: number
    }
}

// Helper type for trimester calculation
export type Trimester = 1 | 2 | 3

// Helper function types
export interface PregnancyProgress {
    currentWeek: number
    trimester: Trimester
    daysRemaining: number
    percentComplete: number
}
