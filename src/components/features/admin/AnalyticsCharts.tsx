"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts"

interface AnalyticsChartsProps {
    growthData: { name: string; patients: number }[]
    appointmentData: { name: string; value: number }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export function AnalyticsCharts({ growthData, appointmentData }: AnalyticsChartsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6 flex flex-col gap-y-1.5">
                    <h3 className="font-semibold leading-none tracking-tight">Patient Growth</h3>
                    <p className="text-sm text-muted-foreground">New patients over the last 6 months</p>
                </div>
                <div className="p-6 pt-0 pl-0">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="name"
                                    className="text-xs"
                                    tick={{ fill: 'currentColor' }}
                                    stroke="currentColor"
                                />
                                <YAxis
                                    className="text-xs"
                                    tick={{ fill: 'currentColor' }}
                                    stroke="currentColor"
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        color: 'hsl(var(--foreground))'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="patients"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6 flex flex-col gap-y-1.5">
                    <h3 className="font-semibold leading-none tracking-tight">Appointment Distribution</h3>
                    <p className="text-sm text-muted-foreground">Appointments by type</p>
                </div>
                <div className="p-6 pt-0">
                    <div className="h-[300px] w-full flex justify-center">
                        {appointmentData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={appointmentData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {appointmentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))',
                                            color: 'hsl(var(--foreground))'
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No appointment data available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
