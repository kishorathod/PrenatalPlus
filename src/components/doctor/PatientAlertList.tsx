"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react"
import { acknowledgeVitalAlert } from "@/server/actions/doctor"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface VitalAlert {
    id: string
    type: string
    severity: "INFO" | "WARNING" | "CRITICAL"
    message: string
    acknowledged: boolean
    acknowledgedAt?: Date | null
    createdAt: Date | string
}

interface VitalReading {
    id: string
    recordedAt: Date | string
    systolic?: number | null
    diastolic?: number | null
    heartRate?: number | null
    alerts: VitalAlert[]
}

interface PatientAlertListProps {
    vitals: VitalReading[]
}

const severityConfig = {
    INFO: {
        icon: Info,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Info",
    },
    WARNING: {
        icon: AlertCircle,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Warning",
    },
    CRITICAL: {
        icon: AlertTriangle,
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Critical",
    },
}

export function PatientAlertList({ vitals }: PatientAlertListProps) {
    const router = useRouter()

    // Collect all alerts from vitals
    const allAlerts = vitals
        .flatMap((vital) =>
            vital.alerts.map((alert) => ({
                ...alert,
                vitalId: vital.id,
                recordedAt: vital.recordedAt,
                systolic: vital.systolic,
                diastolic: vital.diastolic,
                heartRate: vital.heartRate,
            }))
        )
        .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())

    const unacknowledgedAlerts = allAlerts.filter((a) => !a.acknowledged)
    const acknowledgedAlerts = allAlerts.filter((a) => a.acknowledged)

    const handleAcknowledge = async (alertId: string) => {
        try {
            const result = await acknowledgeVitalAlert(alertId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Alert acknowledged")
                router.refresh()
            }
        } catch (error) {
            toast.error("Failed to acknowledge alert")
        }
    }

    if (allAlerts.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Vital Alerts</CardTitle>
                    <CardDescription>No alerts recorded</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[150px] text-muted-foreground">
                        <div className="text-center">
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                            <p>All vitals are within normal ranges</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Vital Alerts</CardTitle>
                <CardDescription>
                    {unacknowledgedAlerts.length} unacknowledged, {acknowledgedAlerts.length} acknowledged
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {unacknowledgedAlerts.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium">Unacknowledged Alerts</h4>
                            {unacknowledgedAlerts.map((alert) => {
                                const config = severityConfig[alert.severity]
                                const Icon = config.icon
                                return (
                                    <div
                                        key={alert.id}
                                        className="p-3 border rounded-lg bg-gray-50"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline" className={config.color}>
                                                        <Icon className="mr-1 h-3 w-3" />
                                                        {config.label}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(alert.recordedAt), "MMM dd, h:mm a")}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium">{alert.message}</p>
                                                {alert.systolic && alert.diastolic && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        BP: {alert.systolic}/{alert.diastolic} mmHg
                                                        {alert.heartRate && ` | HR: ${alert.heartRate} bpm`}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAcknowledge(alert.id)}
                                            >
                                                Acknowledge
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {acknowledgedAlerts.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground">Acknowledged Alerts</h4>
                            {acknowledgedAlerts.slice(0, 5).map((alert) => {
                                const config = severityConfig[alert.severity]
                                const Icon = config.icon
                                return (
                                    <div
                                        key={alert.id}
                                        className="p-3 border rounded-lg opacity-60"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className={config.color}>
                                                <Icon className="mr-1 h-3 w-3" />
                                                {config.label}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(alert.recordedAt), "MMM dd, h:mm a")}
                                            </span>
                                        </div>
                                        <p className="text-sm">{alert.message}</p>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
