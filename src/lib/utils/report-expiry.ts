import { ReportCategory } from "@prisma/client"

// Default expiry days for different report categories
export const REPORT_EXPIRY_DAYS: Partial<Record<ReportCategory, number>> = {
    // Blood tests - 90 days
    COMPLETE_BLOOD_COUNT: 90,
    THYROID_FUNCTION: 90,
    IRON_STUDIES: 90,
    GENETIC_SCREENING: 365, // Valid for entire pregnancy

    // Glucose tests - 28 days
    GLUCOSE_TOLERANCE: 28,

    // Urine tests - 30 days
    ROUTINE_URINALYSIS: 30,
    URINE_CULTURE: 30,
    PROTEIN_TEST: 30,

    // Ultrasounds - valid for specific weeks, not time-based
    // DATING_SCAN: null,
    // ANATOMY_SCAN: null,
    // GROWTH_SCAN: null,
    // DOPPLER_SCAN: null,

    // Other
    VACCINATION_RECORD: 365,
}

/**
 * Calculate expiry date for a report based on its category and report date
 */
export function calculateExpiryDate(
    category: ReportCategory | null,
    reportDate: Date
): Date | null {
    if (!category) return null

    const expiryDays = REPORT_EXPIRY_DAYS[category]
    if (!expiryDays) return null

    const expiryDate = new Date(reportDate)
    expiryDate.setDate(expiryDate.getDate() + expiryDays)

    return expiryDate
}

/**
 * Check if a report is expired
 */
export function isReportExpired(expiryDate: Date | null): boolean {
    if (!expiryDate) return false
    return new Date() > expiryDate
}

/**
 * Get days until expiry (negative if expired)
 */
export function getDaysUntilExpiry(expiryDate: Date | null): number | null {
    if (!expiryDate) return null

    const now = new Date()
    const diffTime = expiryDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
}

/**
 * Check if a report is expiring soon (within 7 days)
 */
export function isExpiringSoon(expiryDate: Date | null): boolean {
    const days = getDaysUntilExpiry(expiryDate)
    if (days === null) return false

    return days > 0 && days <= 7
}

/**
 * Get expiry status
 */
export type ExpiryStatus = "valid" | "expiring_soon" | "expired" | "no_expiry"

export function getExpiryStatus(expiryDate: Date | null): ExpiryStatus {
    if (!expiryDate) return "no_expiry"
    if (isReportExpired(expiryDate)) return "expired"
    if (isExpiringSoon(expiryDate)) return "expiring_soon"
    return "valid"
}

/**
 * Get expiry status message
 */
export function getExpiryMessage(expiryDate: Date | null): string {
    const status = getExpiryStatus(expiryDate)
    const days = getDaysUntilExpiry(expiryDate)

    switch (status) {
        case "expired":
            return `Expired ${Math.abs(days!)} days ago`
        case "expiring_soon":
            return `Expires in ${days} day${days === 1 ? '' : 's'}`
        case "valid":
            return `Valid for ${days} more day${days === 1 ? '' : 's'}`
        case "no_expiry":
            return "No expiry date"
    }
}
