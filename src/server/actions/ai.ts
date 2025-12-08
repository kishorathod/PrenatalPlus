"use server"

import { auth } from "@/server/auth"

export interface SymptomAnalysisResult {
    analysis: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH'
    recommendation: string
    shouldContactDoctor: boolean
}

const HIGH_SEVERITY_SYMPTOMS = [
    'bleeding', 'spotting', 'severe pain', 'vision changes', 'blurred vision',
    'reduced fetal movement', 'no fetal movement', 'severe headache', 'chest pain',
    'difficulty breathing', 'sudden swelling', 'seizure', 'fainting'
]

const MEDIUM_SEVERITY_SYMPTOMS = [
    'fever', 'persistent headache', 'swelling', 'unusual discharge',
    'burning urination', 'severe nausea', 'vomiting', 'cramping'
]

export async function analyzeSymptoms(
    symptoms: string[],
    additionalDetails?: string
): Promise<SymptomAnalysisResult> {
    try {
        const session = await auth()
        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        // Normalize symptoms to lowercase for matching
        const normalizedSymptoms = symptoms.map(s => s.toLowerCase())
        const normalizedDetails = additionalDetails?.toLowerCase() || ''

        // Check for high severity symptoms
        const hasHighSeverity = normalizedSymptoms.some(symptom =>
            HIGH_SEVERITY_SYMPTOMS.some(high => symptom.includes(high))
        ) || HIGH_SEVERITY_SYMPTOMS.some(high => normalizedDetails.includes(high))

        // Check for medium severity symptoms
        const hasMediumSeverity = normalizedSymptoms.some(symptom =>
            MEDIUM_SEVERITY_SYMPTOMS.some(medium => symptom.includes(medium))
        ) || MEDIUM_SEVERITY_SYMPTOMS.some(medium => normalizedDetails.includes(medium))

        // Determine severity
        let severity: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
        let analysis = ''
        let recommendation = ''
        let shouldContactDoctor = false

        if (hasHighSeverity) {
            severity = 'HIGH'
            shouldContactDoctor = true
            analysis = `Based on your symptoms (${symptoms.join(', ')}), this requires immediate medical attention. These symptoms could indicate a serious condition that needs prompt evaluation.`
            recommendation = '🚨 Contact your doctor immediately or visit the emergency room. Do not wait.'
        } else if (hasMediumSeverity) {
            severity = 'MEDIUM'
            shouldContactDoctor = true
            analysis = `Your symptoms (${symptoms.join(', ')}) should be evaluated by a healthcare provider. While not immediately life-threatening, these symptoms warrant medical attention.`
            recommendation = '📞 Schedule an appointment with your doctor within the next 24-48 hours. Monitor your symptoms closely.'
        } else {
            severity = 'LOW'
            analysis = `The symptoms you're experiencing (${symptoms.join(', ')}) are common during pregnancy. While generally not concerning, it's important to monitor them.`
            recommendation = '✅ These symptoms are typically manageable at home. Rest, stay hydrated, and monitor for any changes. Contact your doctor if symptoms worsen or persist.'
        }

        // Add pregnancy-specific context
        if (normalizedSymptoms.some(s => s.includes('nausea') || s.includes('morning sickness'))) {
            analysis += ' Morning sickness is very common, especially in the first trimester.'
        }
        if (normalizedSymptoms.some(s => s.includes('back pain'))) {
            analysis += ' Back pain is common as your body adjusts to pregnancy.'
        }
        if (normalizedSymptoms.some(s => s.includes('fatigue') || s.includes('tired'))) {
            analysis += ' Fatigue is extremely common during pregnancy due to hormonal changes.'
        }

        return {
            analysis,
            severity,
            recommendation,
            shouldContactDoctor
        }

    } catch (error) {
        console.error("Error analyzing symptoms:", error)
        throw new Error("Failed to analyze symptoms")
    }
}
