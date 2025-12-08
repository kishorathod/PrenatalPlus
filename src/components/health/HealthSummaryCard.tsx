"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Activity, Scale, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface HealthSummaryCardProps {
    healthScore: number
    latestVitals: {
        bloodPressure?: string
        heartRate?: number
        weight?: number
        lastRecorded?: string
    }
    trends: {
        bloodPressure: "stable" | "rising" | "falling"
        weight: "stable" | "gaining" | "losing"
    }
}

function getScoreColor(score: number) {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
}

function getTrendIcon(trend: string) {
    if (trend === "rising" || trend === "gaining") return <TrendingUp className="h-4 w-4 text-amber-500" />
    if (trend === "falling" || trend === "losing") return <TrendingDown className="h-4 w-4 text-blue-500" />
    return <Minus className="h-4 w-4 text-gray-400" />
}

export function HealthSummaryCard({ healthScore, latestVitals, trends }: HealthSummaryCardProps) {
    return (
        <Card className="border-gray-100 overflow-hidden">
            <CardContent className="p-0">
                <div className="grid md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {/* Health Score */}
                    <div className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-white">
                        <div className={cn(
                            "w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-2",
                            getScoreColor(healthScore)
                        )}>
                            {healthScore}
                        </div>
                        <p className="text-sm font-medium text-gray-600">Health Score</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {healthScore >= 80 ? "Excellent" : healthScore >= 60 ? "Good" : "Needs Attention"}
                        </p>
                    </div>

                    {/* Blood Pressure */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <Heart className="h-5 w-5 text-red-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Blood Pressure</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                                {latestVitals.bloodPressure || "--/--"}
                            </span>
                            <span className="text-sm text-gray-400">mmHg</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            {getTrendIcon(trends.bloodPressure)}
                            <span className="capitalize">{trends.bloodPressure}</span>
                        </div>
                    </div>

                    {/* Heart Rate */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-pink-50 rounded-lg">
                                <Activity className="h-5 w-5 text-pink-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Heart Rate</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                                {latestVitals.heartRate || "--"}
                            </span>
                            <span className="text-sm text-gray-400">bpm</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Minus className="h-4 w-4 text-gray-400" />
                            <span>Normal range</span>
                        </div>
                    </div>

                    {/* Weight */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Scale className="h-5 w-5 text-blue-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Weight</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                                {latestVitals.weight || "--"}
                            </span>
                            <span className="text-sm text-gray-400">kg</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            {getTrendIcon(trends.weight)}
                            <span className="capitalize">{trends.weight}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
