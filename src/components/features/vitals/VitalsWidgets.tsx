"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Weight, Activity } from "lucide-react"

interface VitalsWidgetsProps {
    userId: string
}

export function VitalsWidgets({ userId }: VitalsWidgetsProps) {
    const [latestVital, setLatestVital] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLatestVitals = async () => {
            try {
                const response = await fetch("/api/vitals?limit=1")
                const data = await response.json()
                if (data.vitals && data.vitals.length > 0) {
                    setLatestVital(data.vitals[0])
                }
            } catch (error) {
                console.error("Failed to fetch latest vitals:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchLatestVitals()
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
                                {latestVital?.systolic && latestVital?.diastolic
                                    ? `${latestVital.systolic}/${latestVital.diastolic}`
                                    : "--/--"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">mmHg</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                            <Heart className="h-6 w-6 text-red-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Weight */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Weight</p>
                            <p className="text-2xl font-bold">
                                {latestVital?.weight ? `${latestVital.weight}` : "--"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">kg</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Weight className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Heart Rate */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Heart Rate</p>
                            <p className="text-2xl font-bold">
                                {latestVital?.heartRate ? `${latestVital.heartRate}` : "--"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">bpm</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                            <Activity className="h-6 w-6 text-pink-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
