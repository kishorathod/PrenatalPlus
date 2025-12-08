"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { generatePregnancySummary, generateVitalsReport, downloadPDF } from "@/lib/pdf-generator"

interface GenerateReportClientProps {
    patientData: {
        name: string
        currentWeek: number
        dueDate: Date
        riskLevel?: string
    }
    vitals: any[]
    appointments: any[]
}

export function GenerateReportClient({ patientData, vitals, appointments }: GenerateReportClientProps) {
    const [generating, setGenerating] = useState(false)

    const handleGeneratePregnancySummary = () => {
        setGenerating(true)
        try {
            const doc = generatePregnancySummary({
                patient: {
                    patientName: patientData.name,
                    currentWeek: patientData.currentWeek,
                    dueDate: patientData.dueDate,
                    riskLevel: patientData.riskLevel
                },
                vitals,
                appointments
            })
            downloadPDF(doc, `pregnancy-summary-${patientData.name.replace(/\s+/g, "-")}.pdf`)
        } finally {
            setGenerating(false)
        }
    }

    const handleGenerateVitalsReport = () => {
        setGenerating(true)
        try {
            const doc = generateVitalsReport({
                patientName: patientData.name,
                vitals
            })
            downloadPDF(doc, `vitals-report-${patientData.name.replace(/\s+/g, "-")}.pdf`)
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleGeneratePregnancySummary}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-pink-500" />
                        Pregnancy Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                        Complete pregnancy report including vitals, appointments, and progress
                    </p>
                    <Button disabled={generating} className="w-full bg-pink-500 hover:bg-pink-600">
                        <Download className="mr-2 h-4 w-4" />
                        {generating ? "Generating..." : "Generate PDF"}
                    </Button>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleGenerateVitalsReport}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        Vitals History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                        Detailed vitals history with blood pressure, heart rate, and weight trends
                    </p>
                    <Button disabled={generating} className="w-full bg-blue-500 hover:bg-blue-600">
                        <Download className="mr-2 h-4 w-4" />
                        {generating ? "Generating..." : "Generate PDF"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
