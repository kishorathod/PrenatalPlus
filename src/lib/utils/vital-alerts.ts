import { AlertType, AlertSeverity } from "@prisma/client"

export interface AlertThreshold {
    check: (value: number, context?: any) => boolean
    type: AlertType
    severity: AlertSeverity
    getMessage: (value: number, context?: any) => string
}

export interface VitalAlertData {
    type: AlertType
    severity: AlertSeverity
    message: string
}

// Blood Pressure Thresholds
export const BLOOD_PRESSURE_THRESHOLDS: AlertThreshold[] = [
    {
        check: (systolic: number, diastolic: number) => systolic >= 140 || diastolic >= 90,
        type: "HIGH_BLOOD_PRESSURE",
        severity: "CRITICAL",
        getMessage: (systolic, diastolic) =>
            `Blood pressure is critically high (${systolic}/${diastolic} mmHg). Please contact your healthcare provider immediately.`,
    },
    {
        check: (systolic: number, diastolic: number) =>
            (systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90),
        type: "HIGH_BLOOD_PRESSURE",
        severity: "WARNING",
        getMessage: (systolic, diastolic) =>
            `Blood pressure is elevated (${systolic}/${diastolic} mmHg). Monitor closely and consult your doctor.`,
    },
    {
        check: (systolic: number, diastolic: number) => systolic < 90 || diastolic < 60,
        type: "LOW_BLOOD_PRESSURE",
        severity: "WARNING",
        getMessage: (systolic, diastolic) =>
            `Blood pressure is low (${systolic}/${diastolic} mmHg). Stay hydrated and rest.`,
    },
]

// Heart Rate Thresholds
export const HEART_RATE_THRESHOLDS: AlertThreshold[] = [
    {
        check: (hr: number) => hr > 120,
        type: "HIGH_HEART_RATE",
        severity: "CRITICAL",
        getMessage: (hr) =>
            `Heart rate is very high (${hr} bpm). Please seek medical attention.`,
    },
    {
        check: (hr: number) => hr > 100 && hr <= 120,
        type: "HIGH_HEART_RATE",
        severity: "WARNING",
        getMessage: (hr) =>
            `Heart rate is elevated (${hr} bpm). Rest and monitor.`,
    },
    {
        check: (hr: number) => hr < 60,
        type: "LOW_HEART_RATE",
        severity: "INFO",
        getMessage: (hr) =>
            `Heart rate is low (${hr} bpm). This may be normal if you're physically fit.`,
    },
]

// Weight Gain Threshold (requires previous weight)
export const checkWeightGain = (
    currentWeight: number,
    previousWeight: number,
    daysBetween: number
): VitalAlertData | null => {
    const weightGain = currentWeight - previousWeight
    const weeksBetween = daysBetween / 7
    const weeklyGain = weightGain / weeksBetween

    if (weeklyGain > 2) {
        return {
            type: "RAPID_WEIGHT_GAIN",
            severity: "WARNING",
            message: `Rapid weight gain detected (${weightGain.toFixed(1)} kg in ${daysBetween} days). Please consult your healthcare provider.`,
        }
    }

    return null
}

// Glucose Thresholds
export const GLUCOSE_THRESHOLDS: AlertThreshold[] = [
    {
        check: (glucose: number) => glucose >= 126,
        type: "HIGH_GLUCOSE",
        severity: "CRITICAL",
        getMessage: (glucose) =>
            `Blood glucose is very high (${glucose} mg/dL). Contact your doctor immediately.`,
    },
    {
        check: (glucose: number) => glucose >= 95 && glucose < 126,
        type: "HIGH_GLUCOSE",
        severity: "WARNING",
        getMessage: (glucose) =>
            `Blood glucose is elevated (${glucose} mg/dL). Monitor your diet and consult your doctor.`,
    },
]

// SpO2 Thresholds
export const SPO2_THRESHOLDS: AlertThreshold[] = [
    {
        check: (spo2: number) => spo2 < 90,
        type: "LOW_SPO2",
        severity: "CRITICAL",
        getMessage: (spo2) =>
            `Oxygen saturation is critically low (${spo2}%). Seek immediate medical attention.`,
    },
    {
        check: (spo2: number) => spo2 >= 90 && spo2 < 95,
        type: "LOW_SPO2",
        severity: "WARNING",
        getMessage: (spo2) =>
            `Oxygen saturation is low (${spo2}%). Rest and monitor closely.`,
    },
]

// Fetal Movement Threshold (after week 28)
export const checkFetalMovement = (
    count: number,
    week?: number
): VitalAlertData | null => {
    if (week && week >= 28 && count < 10) {
        return {
            type: "REDUCED_FETAL_MOVEMENT",
            severity: "CRITICAL",
            message: `Reduced fetal movement detected (${count} movements per hour). Contact your healthcare provider immediately.`,
        }
    }

    return null
}

// Main function to generate alerts from a vital reading
export function generateAlertsFromReading(reading: {
    systolic?: number | null
    diastolic?: number | null
    heartRate?: number | null
    weight?: number | null
    glucose?: number | null
    spo2?: number | null
    fetalMovement?: number | null
    week?: number | null
}, previousReading?: {
    weight?: number | null
    recordedAt: Date
}, currentDate: Date = new Date()): VitalAlertData[] {
    const alerts: VitalAlertData[] = []

    // Check blood pressure
    if (reading.systolic && reading.diastolic) {
        for (const threshold of BLOOD_PRESSURE_THRESHOLDS) {
            if (threshold.check(reading.systolic, reading.diastolic)) {
                alerts.push({
                    type: threshold.type,
                    severity: threshold.severity,
                    message: threshold.getMessage(reading.systolic, reading.diastolic),
                })
                break // Only add the most severe alert
            }
        }
    }

    // Check heart rate
    if (reading.heartRate) {
        for (const threshold of HEART_RATE_THRESHOLDS) {
            if (threshold.check(reading.heartRate)) {
                alerts.push({
                    type: threshold.type,
                    severity: threshold.severity,
                    message: threshold.getMessage(reading.heartRate),
                })
                break
            }
        }
    }

    // Check weight gain
    if (reading.weight && previousReading?.weight) {
        const daysBetween = Math.floor(
            (currentDate.getTime() - new Date(previousReading.recordedAt).getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysBetween > 0) {
            const weightAlert = checkWeightGain(reading.weight, previousReading.weight, daysBetween)
            if (weightAlert) {
                alerts.push(weightAlert)
            }
        }
    }

    // Check glucose
    if (reading.glucose) {
        for (const threshold of GLUCOSE_THRESHOLDS) {
            if (threshold.check(reading.glucose)) {
                alerts.push({
                    type: threshold.type,
                    severity: threshold.severity,
                    message: threshold.getMessage(reading.glucose),
                })
                break
            }
        }
    }

    // Check SpO2
    if (reading.spo2) {
        for (const threshold of SPO2_THRESHOLDS) {
            if (threshold.check(reading.spo2)) {
                alerts.push({
                    type: threshold.type,
                    severity: threshold.severity,
                    message: threshold.getMessage(reading.spo2),
                })
                break
            }
        }
    }

    // Check fetal movement
    if (reading.fetalMovement !== null && reading.fetalMovement !== undefined) {
        const movementAlert = checkFetalMovement(reading.fetalMovement, reading.week ?? undefined)
        if (movementAlert) {
            alerts.push(movementAlert)
        }
    }

    return alerts
}
