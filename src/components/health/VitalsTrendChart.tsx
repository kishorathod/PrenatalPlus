"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format } from "date-fns"

interface VitalsTrend {
    date: string
    systolic?: number
    diastolic?: number
    heartRate?: number
    weight?: number
}

interface VitalsTrendChartProps {
    data: VitalsTrend[]
}

const CHART_CONFIGS = {
    bloodPressure: {
        title: "Blood Pressure",
        lines: [
            { key: "systolic", color: "#ef4444", name: "Systolic" },
            { key: "diastolic", color: "#3b82f6", name: "Diastolic" }
        ],
        unit: "mmHg"
    },
    heartRate: {
        title: "Heart Rate",
        lines: [
            { key: "heartRate", color: "#ec4899", name: "Heart Rate" }
        ],
        unit: "bpm"
    },
    weight: {
        title: "Weight",
        lines: [
            { key: "weight", color: "#8b5cf6", name: "Weight" }
        ],
        unit: "kg"
    }
}

type ChartType = keyof typeof CHART_CONFIGS

export function VitalsTrendChart({ data }: VitalsTrendChartProps) {
    const [activeChart, setActiveChart] = useState<ChartType>("bloodPressure")
    const config = CHART_CONFIGS[activeChart]

    const formattedData = data.map(d => ({
        ...d,
        dateLabel: format(new Date(d.date), "MMM d")
    }))

    return (
        <Card className="border-gray-100">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{config.title} Trend</CardTitle>
                    <div className="flex gap-1">
                        {(Object.keys(CHART_CONFIGS) as ChartType[]).map((type) => (
                            <Button
                                key={type}
                                variant={activeChart === type ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setActiveChart(type)}
                                className={activeChart === type ? "bg-pink-500 hover:bg-pink-600" : ""}
                            >
                                {CHART_CONFIGS[type].title.split(" ")[0]}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <p>No data available. Record your first vitals to see trends.</p>
                    </div>
                ) : (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formattedData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="dateLabel"
                                    tick={{ fontSize: 12 }}
                                    stroke="#9ca3af"
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    stroke="#9ca3af"
                                    unit={` ${config.unit}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px"
                                    }}
                                />
                                <Legend />
                                {config.lines.map((line) => (
                                    <Line
                                        key={line.key}
                                        type="monotone"
                                        dataKey={line.key}
                                        stroke={line.color}
                                        strokeWidth={2}
                                        dot={{ fill: line.color, strokeWidth: 2 }}
                                        name={line.name}
                                        connectNulls
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
