export type VitalParsedData = {
    bpSystolic?: number
    bpDiastolic?: number
    weight?: number
    heartRate?: number
}

export function parseVitalVoiceCommand(text: string): VitalParsedData {
    const lower = text.toLowerCase()
    const result: VitalParsedData = {}

    // Blood Pressure Pattern: "120 over 80", "120/80", "BP 120 80"
    const bpRegex = /(?:bp|blood pressure)?\s*(\d{2,3})\s*(?:over|\/|\s)\s*(\d{2,3})/i
    const bpMatch = lower.match(bpRegex)
    if (bpMatch) {
        result.bpSystolic = parseInt(bpMatch[1])
        result.bpDiastolic = parseInt(bpMatch[2])
    }

    // Weight Pattern: "weight 70.5", "70 kg"
    // Look for number near "weight" or followed by "kg"
    const weightRegex = /(?:weight\s*)?(\d{2,3}(?:\.\d)?)\s*(?:kg|kilo)/i
    const weightMatch = lower.match(weightRegex)

    // Fallback simple number if "weight" word exists
    const weightSimpleRegex = /weight\s*(\d{2,3}(?:\.\d)?)/i
    const weightSimpleMatch = lower.match(weightSimpleRegex)

    if (weightMatch) {
        result.weight = parseFloat(weightMatch[1])
    } else if (weightSimpleMatch) {
        result.weight = parseFloat(weightSimpleMatch[1])
    }

    // Heart Rate Pattern: "heart rate 75", "pulse 75", "75 bpm"
    const hrRegex = /(?:heart rate|pulse|hr)\s*(\d{2,3})/i
    const hrMatch = lower.match(hrRegex)
    const bpmRegex = /(\d{2,3})\s*bpm/i
    const bpmMatch = lower.match(bpmRegex)

    if (hrMatch) {
        result.heartRate = parseInt(hrMatch[1])
    } else if (bpmMatch) {
        result.heartRate = parseInt(bpmMatch[1])
    }

    return result
}
