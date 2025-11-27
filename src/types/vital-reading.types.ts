import { VitalReading, VitalAlert, AlertType, AlertSeverity } from "@prisma/client"

export type { VitalReading, VitalAlert, AlertType, AlertSeverity }

export interface CreateVitalReadingInput {
    // Blood Pressure
    systolic?: number
    diastolic?: number

    // Other vitals
    heartRate?: number
    weight?: number
    temperature?: number
    glucose?: number
    spo2?: number
    fetalMovement?: number

    // Metadata
    week?: number
    notes?: string
    recordedAt?: Date
    pregnancyId?: string
}

export interface UpdateVitalReadingInput extends Partial<CreateVitalReadingInput> { }

export interface VitalReadingWithAlerts extends VitalReading {
    alerts: VitalAlert[]
}

export interface VitalStats {
    averageSystolic?: number
    averageDiastolic?: number
    averageHeartRate?: number
    currentWeight?: number
    weightGain?: number
    lastReading?: VitalReadingWithAlerts
    totalReadings: number
    activeAlerts: number
}
