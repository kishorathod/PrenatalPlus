"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertTriangle, Info, CheckCircle, Phone } from "lucide-react"
import { analyzeSymptoms, type SymptomAnalysisResult } from "@/server/actions/ai"
import { cn } from "@/lib/utils"

const COMMON_SYMPTOMS = [
    "Fever",
    "Nausea / Morning Sickness",
    "Headache",
    "Dizziness",
    "Lower Belly Pain",
    "Back Pain",
    "Swelling (Hands/Feet)",
    "Bleeding/Spotting",
    "Severe Cramping",
    "Vision Changes",
    "Reduced Fetal Movement",
    "Unusual Discharge",
    "Fatigue",
    "Heartburn",
    "Constipation",
    "Leg Cramps"
]

export function SymptomChecker() {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
    const [additionalDetails, setAdditionalDetails] = useState("")
    const [result, setResult] = useState<SymptomAnalysisResult | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const toggleSymptom = (symptom: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptom)
                ? prev.filter(s => s !== symptom)
                : [...prev, symptom]
        )
    }

    const handleAnalyze = async () => {
        if (selectedSymptoms.length === 0) {
            return
        }

        setIsAnalyzing(true)
        try {
            const analysis = await analyzeSymptoms(selectedSymptoms, additionalDetails)
            setResult(analysis)
        } catch (error) {
            console.error("Error analyzing symptoms:", error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleReset = () => {
        setSelectedSymptoms([])
        setAdditionalDetails("")
        setResult(null)
    }

    const getSeverityConfig = (severity: string) => {
        switch (severity) {
            case 'HIGH':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: AlertTriangle,
                    iconColor: 'text-red-600'
                }
            case 'MEDIUM':
                return {
                    color: 'bg-orange-100 text-orange-800 border-orange-200',
                    icon: Info,
                    iconColor: 'text-orange-600'
                }
            default:
                return {
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: CheckCircle,
                    iconColor: 'text-green-600'
                }
        }
    }

    return (
        <div className="space-y-6">
            {/* Symptom Selection */}
            <Card className="border-gray-100">
                <CardHeader>
                    <CardTitle className="text-xl">Select Your Symptoms</CardTitle>
                    <CardDescription>
                        Choose all symptoms you're currently experiencing
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {COMMON_SYMPTOMS.map((symptom) => (
                            <button
                                key={symptom}
                                onClick={() => toggleSymptom(symptom)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    selectedSymptoms.includes(symptom)
                                        ? "bg-pink-500 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                {symptom}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Additional Details (Optional)
                        </label>
                        <Textarea
                            placeholder="Describe your symptoms in more detail, when they started, how severe they are, etc."
                            value={additionalDetails}
                            onChange={(e) => setAdditionalDetails(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={handleAnalyze}
                            disabled={selectedSymptoms.length === 0 || isAnalyzing}
                            className="bg-pink-500 hover:bg-pink-600"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze Symptoms'
                            )}
                        </Button>
                        {selectedSymptoms.length > 0 && (
                            <Button onClick={handleReset} variant="outline">
                                Reset
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            {result && (
                <Card className={cn(
                    "border-2",
                    result.severity === 'HIGH' ? 'border-red-200 bg-red-50/50' :
                        result.severity === 'MEDIUM' ? 'border-orange-200 bg-orange-50/50' :
                            'border-green-200 bg-green-50/50'
                )}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">Analysis Results</CardTitle>
                            <Badge className={getSeverityConfig(result.severity).color}>
                                {result.severity} SEVERITY
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Analysis */}
                        <div className="flex gap-3">
                            {(() => {
                                const Icon = getSeverityConfig(result.severity).icon
                                return <Icon className={cn("h-6 w-6 flex-shrink-0 mt-0.5", getSeverityConfig(result.severity).iconColor)} />
                            })()}
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">What This Means</h3>
                                <p className="text-gray-700 leading-relaxed">{result.analysis}</p>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <Alert className={cn(
                            "border-2",
                            result.severity === 'HIGH' ? 'bg-red-100 border-red-300' :
                                result.severity === 'MEDIUM' ? 'bg-orange-100 border-orange-300' :
                                    'bg-green-100 border-green-300'
                        )}>
                            <AlertDescription className="text-sm font-medium">
                                {result.recommendation}
                            </AlertDescription>
                        </Alert>

                        {/* Contact Doctor Button */}
                        {result.shouldContactDoctor && (
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                                <Phone className="mr-2 h-5 w-5" />
                                Contact Your Doctor
                            </Button>
                        )}

                        {/* Disclaimer */}
                        <p className="text-xs text-gray-500 text-center pt-2 border-t">
                            ⚠️ This is an AI-powered analysis and should not replace professional medical advice.
                            Always consult with your healthcare provider for accurate diagnosis and treatment.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
