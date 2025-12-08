"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Activity } from "lucide-react"
import { format } from "date-fns"

interface VitalsTrendChartProps {
    data: any[]
}

export function VitalsTrendChart({ data }: VitalsTrendChartProps) {
    const formattedData = data.map(item => ({
        ...item,
        date: format(new Date(item.date), 'MMM dd'),
    }))

    return (
        <Card className="border-none shadow-sm dark:bg-gray-900/50 dark:border-white/10">
            <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Activity className="h-5 w-5 text-pink-500" />
                    Health Trends
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:stroke-gray-800" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                        />
                        <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            itemStyle={{ color: '#111827' }}
                        />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="weight"
                            name="Weight (kg)"
                            stroke="#EC4899"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#EC4899" }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="bloodPressureSystolic"
                            name="Systolic BP"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#8b5cf6" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
