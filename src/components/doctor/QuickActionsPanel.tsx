"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Pill, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"

export function QuickActionsPanel() {
    const actions = [
        {
            icon: ClipboardList,
            label: "Add Medical Note",
            href: "/doctor/notes",
            color: "bg-blue-50 text-blue-600 hover:bg-blue-100"
        },
        {
            icon: Pill,
            label: "Create Prescription",
            href: "/doctor/patients",
            color: "bg-purple-50 text-purple-600 hover:bg-purple-100"
        },
        {
            icon: Calendar,
            label: "View Appointments",
            href: "/doctor/appointments",
            color: "bg-green-50 text-green-600 hover:bg-green-100"
        },
        {
            icon: MessageSquare,
            label: "View Messages",
            href: "/doctor/chat",
            color: "bg-pink-50 text-pink-600 hover:bg-pink-100"
        }
    ]

    return (
        <div className="grid grid-cols-2 gap-3">
            {actions.map((action) => (
                <Link key={action.label} href={action.href}>
                    <Button
                        variant="ghost"
                        className={`w-full h-auto flex-col gap-2 p-4 ${action.color}`}
                    >
                        <action.icon className="h-6 w-6" />
                        <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                </Link>
            ))}
        </div>
    )
}
