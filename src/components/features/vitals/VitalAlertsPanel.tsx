"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, AlertCircle, Info, Check, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface VitalAlert {
    id: string
    type: string
    severity: "INFO" | "WARNING" | "CRITICAL"
    message: string
    acknowledged: boolean
    acknowledgedAt: Date | null
    createdAt: Date
    reading: {
        id: string
        recordedAt: Date
        systolic?: number | null
        diastolic?: number | null
        heartRate?: number | null
        weight?: number | null
        glucose?: number | null
        spo2?: number | null
        fetalMovement?: number | null
    }
}

export function VitalAlertsPanel() {
    const [alerts, setAlerts] = useState<VitalAlert[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchAlerts = async () => {
        try {
            const response = await fetch("/api/vitals/alerts?unacknowledgedOnly=true")
            if (!response.ok) throw new Error("Failed to fetch alerts")

            const data = await response.json()
            setAlerts(data.alerts)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAlerts()
    }, [])

    const acknowledgeAlert = async (alertId: string) => {
        setAcknowledgingId(alertId)
        try {
            const response = await fetch(`/api/vitals/alerts/${alertId}`, {
                method: "PATCH",
            })

            if (!response.ok) throw new Error("Failed to acknowledge alert")

            toast({
                title: "Alert Acknowledged",
                description: "The alert has been marked as acknowledged",
            })

            // Remove from list
            setAlerts(alerts.filter(a => a.id !== alertId))
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setAcknowledgingId(null)
        }
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case "CRITICAL":
                return <AlertTriangle className="h-5 w-5" />
            case "WARNING":
                return <AlertCircle className="h-5 w-5" />
            case "INFO":
                return <Info className="h-5 w-5" />
            default:
                return null
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "CRITICAL":
                return "bg-red-50 border-red-200 text-red-800"
            case "WARNING":
                return "bg-yellow-50 border-yellow-200 text-yellow-800"
            case "INFO":
                return "bg-blue-50 border-blue-200 text-blue-800"
            default:
                return "bg-gray-50 border-gray-200 text-gray-800"
        }
    }

    const getBadgeVariant = (severity: string): "default" | "destructive" | "secondary" => {
        switch (severity) {
            case "CRITICAL":
                return "destructive"
            case "WARNING":
                return "default"
            case "INFO":
                return "secondary"
            default:
                return "default"
        }
    }

    if (isLoading) {
        return (
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm rounded-xl">
                <CardContent className="p-6 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </CardContent>
            </Card>
        )
    }

    if (alerts.length === 0) {
        return (
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm rounded-xl">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">Health Alerts</CardTitle>
                    <CardDescription className="text-sm text-gray-500">No active alerts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="p-3 rounded-full bg-green-50 mb-3">
                            <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-600">All vitals are within normal range</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm rounded-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold text-gray-800">Health Alerts</CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                            {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
                        </CardDescription>
                    </div>
                    <Badge variant="destructive" className="rounded-full">
                        {alerts.filter(a => a.severity === "CRITICAL").length} Critical
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {alerts.map((alert) => (
                    <Alert
                        key={alert.id}
                        className={`${getSeverityColor(alert.severity)} border rounded-xl`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {getSeverityIcon(alert.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant={getBadgeVariant(alert.severity)} className="text-xs">
                                        {alert.severity}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                        {format(new Date(alert.createdAt), "MMM d, h:mm a")}
                                    </span>
                                </div>
                                <AlertDescription className="text-sm font-medium mb-2">
                                    {alert.message}
                                </AlertDescription>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-600">
                                        Reading from {format(new Date(alert.reading.recordedAt), "MMM d, h:mm a")}
                                    </p>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => acknowledgeAlert(alert.id)}
                                        disabled={acknowledgingId === alert.id}
                                        className="rounded-lg"
                                    >
                                        {acknowledgingId === alert.id ? (
                                            <>
                                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                Acknowledging...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="mr-2 h-3 w-3" />
                                                Acknowledge
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Alert>
                ))}
            </CardContent>
        </Card>
    )
}
