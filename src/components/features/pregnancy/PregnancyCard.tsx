"use client"

import { Pregnancy } from "@/types/pregnancy.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Edit, Heart, Activity } from "lucide-react"
import { format, differenceInWeeks } from "date-fns"
import Link from "next/link"

interface PregnancyCardProps {
    pregnancy: Pregnancy
    onEdit?: () => void
}

export function PregnancyCard({ pregnancy, onEdit }: PregnancyCardProps) {
    const currentWeek = Math.max(
        0,
        differenceInWeeks(new Date(), new Date(pregnancy.startDate))
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-500"
            case "COMPLETED":
                return "bg-blue-500"
            case "TERMINATED":
                return "bg-gray-500"
            default:
                return "bg-gray-500"
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">
                    Pregnancy Record
                </CardTitle>
                <Badge className={getStatusColor(pregnancy.status)}>
                    {pregnancy.status}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span className="text-sm">Current Week</span>
                        </div>
                        <span className="font-semibold">{currentWeek} weeks</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">Due Date</span>
                        </div>
                        <span className="font-semibold">
                            {format(new Date(pregnancy.dueDate), "PP")}
                        </span>
                    </div>

                    {pregnancy.bloodType && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Heart className="h-4 w-4" />
                                <span className="text-sm">Blood Type</span>
                            </div>
                            <span className="font-semibold">
                                {pregnancy.bloodType}
                                {pregnancy.rhFactor && ` ${pregnancy.rhFactor}`}
                            </span>
                        </div>
                    )}

                    {/* Risk Level temporarily disabled */}
                </div>

                {onEdit && (
                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
