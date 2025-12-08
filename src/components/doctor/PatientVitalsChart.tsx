"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { format } from "date-fns"

interface VitalReading {
    id: string
    systolic?: number | null
    diastolic?: number | null
    heartRate?: number | null
    weight?: number | null
    recordedAt: Date | string
}

interface PatientVitalsChartProps {
    vitals: VitalReading[]
}

export function PatientVitalsChart({ vitals }: PatientVitalsChartProps) {
    if (!vitals || vitals.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Vitals Trends</CardTitle>
                    <CardDescription>Blood pressure, heart rate, and weight over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No vital readings available
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Prepare data for charting (reverse to show oldest first)
    const chartData = vitals
        .slice()
        .reverse()
        .map((vital) => ({
            date: format(new Date(vital.recordedAt), "MMM dd"),
            systolic: vital.systolic,
            diastolic: vital.diastolic,
            heartRate: vital.heartRate,
            weight: vital.weight,
        }))

    // Determine which metrics are available
    const hasBP = vitals.some((v) => v.systolic || v.diastolic)
    const hasHeartRate = vitals.some((v) => v.heartRate)
    const hasWeight = vitals.some((v) => v.weight)

    return (
        <div className="space-y-4">
            {/* Blood Pressure Chart */}
            {hasBP && (
                <Card>
                    <CardHeader>
                        <CardTitle>Blood Pressure Trends</CardTitle>
                        <CardDescription>Systolic and Diastolic (mmHg)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[80, 180]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="systolic"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    name="Systolic"
                                    dot={{ r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="diastolic"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    name="Diastolic"
                                    dot={{ r: 4 }}
                                />
                                {/* Reference lines for healthy ranges */}
                                <Line
                                    type="monotone"
                                    dataKey={() => 140}
                                    stroke="#dc2626"
                                    strokeWidth={1}
                                    strokeDasharray="5 5"
                                    name="High BP Threshold"
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey={() => 90}
                                    stroke="#dc2626"
                                    strokeWidth={1}
                                    strokeDasharray="5 5"
                                    name="High Diastolic Threshold"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Heart Rate & Weight Chart */}
            {(hasHeartRate || hasWeight) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Heart Rate & Weight Trends</CardTitle>
                        <CardDescription>
                            {hasHeartRate && "Heart Rate (bpm)"}
                            {hasHeartRate && hasWeight && " | "}
                            {hasWeight && "Weight (kg)"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {hasHeartRate && (
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[50, 120]} />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="heartRate"
                                            stroke="#8b5cf6"
                                            strokeWidth={2}
                                            name="Heart Rate (bpm)"
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                            {hasWeight && (
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="weight"
                                            stroke="#22c55e"
                                            strokeWidth={2}
                                            name="Weight (kg)"
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
