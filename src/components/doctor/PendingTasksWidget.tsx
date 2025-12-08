"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface PendingTasksWidgetProps {
    tasks: {
        unreadMessages: number
        pendingAppointments: number
        patientsWithAlerts: number
    }
}

export function PendingTasksWidget({ tasks }: PendingTasksWidgetProps) {
    const taskItems = [
        {
            icon: MessageSquare,
            label: "Unread Messages",
            count: tasks.unreadMessages,
            href: "/doctor/chat",
            color: "text-blue-600"
        },
        {
            icon: Calendar,
            label: "Pending Appointments",
            count: tasks.pendingAppointments,
            href: "/doctor/appointments",
            color: "text-green-600"
        },
        {
            icon: AlertTriangle,
            label: "Patient Alerts",
            count: tasks.patientsWithAlerts,
            href: "/doctor/patients",
            color: "text-red-600"
        }
    ]

    return (
        <div className="space-y-3">
            {taskItems.map((item) => (
                <Link key={item.label} href={item.href}>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gray-100 ${item.color}`}>
                                <item.icon className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        {item.count > 0 && (
                            <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                                {item.count}
                            </Badge>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    )
}
