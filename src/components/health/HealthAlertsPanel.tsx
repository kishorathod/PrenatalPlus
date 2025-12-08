"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface HealthAlert {
    id: string
    type: "warning" | "critical"
    message: string
    vital: string
    value: number
    date: string
}

interface HealthAlertsPanelProps {
    alerts: HealthAlert[]
}

export function HealthAlertsPanel({ alerts }: HealthAlertsPanelProps) {
    if (alerts.length === 0) {
        return null
    }

    return (
        <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="h-5 w-5" />
                    Health Alerts
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={cn(
                                "p-3 rounded-lg border flex items-start gap-3",
                                alert.type === "critical"
                                    ? "bg-red-50 border-red-200"
                                    : "bg-amber-50 border-amber-200"
                            )}
                        >
                            <div className={cn(
                                "p-1.5 rounded-full",
                                alert.type === "critical" ? "bg-red-100" : "bg-amber-100"
                            )}>
                                <AlertCircle className={cn(
                                    "h-4 w-4",
                                    alert.type === "critical" ? "text-red-600" : "text-amber-600"
                                )} />
                            </div>
                            <div className="flex-1">
                                <p className={cn(
                                    "font-medium text-sm",
                                    alert.type === "critical" ? "text-red-800" : "text-amber-800"
                                )}>
                                    {alert.message}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    {alert.vital}: {alert.value} • {format(new Date(alert.date), "MMM d, h:mm a")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
