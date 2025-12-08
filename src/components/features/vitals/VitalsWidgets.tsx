"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Weight, Activity, TrendingUp, TrendingDown } from "lucide-react"

interface VitalsWidgetsProps {
    userId: string
}

export function VitalsWidgets({ userId }: VitalsWidgetsProps) {
    const [todayVitals, setTodayVitals] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTodayVitals = async () => {
            try {
                const response = await fetch("/api/vitals/today")
                const data = await response.json()
                setTodayVitals(data)
            } catch (error) {
                console.error("Failed to fetch today's vitals:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTodayVitals()
    }, [])

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-16 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-3 mb-6">
            {/* Blood Pressure */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Blood Pressure</p>
                            <p className="text-2xl font-bold">
                                {todayVitals?.bp ? `${todayVitals.bp.systolic}/${todayVitals.bp.diastolic}` : "--/--"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">mmHg</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                            <Heart className="h-6 w-6 text-red-500" />
                        </div>
                    </div>
                    {todayVitals?.bp?.trend && (
                        <div className="mt-2 flex items-center text-xs">
                            {todayVitals.bp.trend === "up" ? (
                                <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                            )}
                            <span className={todayVitals.bp.trend === "up" ? "text-red-500" : "text-green-500"}>
                                {todayVitals.bp.trend === "up" ? "Higher" : "Lower"} than average
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Weight */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Weight</p>
                            <p className="text-2xl font-bold">
                                {todayVitals?.weight ? `${todayVitals.weight.value}` : "--"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">kg</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Weight className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                    {todayVitals?.weight?.change && (
                        <div className="mt-2 text-xs text-gray-600">
                            {todayVitals.weight.change > 0 ? "+" : ""}{todayVitals.weight.change.toFixed(1)} kg this week
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Heart Rate */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Heart Rate</p>
                            <p className="text-2xl font-bold">
                                {todayVitals?.heartRate ? `${todayVitals.heartRate.value}` : "--"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">bpm</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                            <Activity className="h-6 w-6 text-pink-500" />
                        </div>
                    </div>
                    {todayVitals?.heartRate?.status && (
                        <div className="mt-2 text-xs text-gray-600">
                            {todayVitals.heartRate.status}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
