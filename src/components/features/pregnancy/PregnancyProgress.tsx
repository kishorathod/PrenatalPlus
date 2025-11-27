"use client"

import { Pregnancy, Trimester } from "@/types/pregnancy.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Baby, Heart } from "lucide-react"
import { differenceInDays, differenceInWeeks, format } from "date-fns"

interface PregnancyProgressProps {
    pregnancy: Pregnancy
}

function calculateProgress(pregnancy: Pregnancy) {
    const today = new Date()
    const startDate = new Date(pregnancy.startDate)
    const dueDate = new Date(pregnancy.dueDate)

    const totalWeeks = differenceInWeeks(dueDate, startDate)
    const currentWeek = Math.min(differenceInWeeks(today, startDate), totalWeeks)
    const daysRemaining = Math.max(differenceInDays(dueDate, today), 0)
    const percentComplete = Math.min((currentWeek / totalWeeks) * 100, 100)

    // Determine trimester (1-13 weeks = 1st, 14-26 = 2nd, 27+ = 3rd)
    let trimester: Trimester = 1
    if (currentWeek >= 27) trimester = 3
    else if (currentWeek >= 14) trimester = 2

    return {
        currentWeek,
        trimester,
        daysRemaining,
        percentComplete,
        totalWeeks,
    }
}

function getTrimesterInfo(trimester: Trimester) {
    const info = {
        1: {
            label: "First Trimester",
            color: "bg-blue-500",
            description: "Weeks 1-13",
        },
        2: {
            label: "Second Trimester",
            color: "bg-purple-500",
            description: "Weeks 14-26",
        },
        3: {
            label: "Third Trimester",
            color: "bg-pink-500",
            description: "Weeks 27-40",
        },
    }
    return info[trimester]
}

export function PregnancyProgress({ pregnancy }: PregnancyProgressProps) {
    const progress = calculateProgress(pregnancy)
    const trimesterInfo = getTrimesterInfo(progress.trimester)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Baby className="h-5 w-5" />
                    Pregnancy Progress
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Current Week */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Current Week</span>
                        <span className="text-2xl font-bold">{progress.currentWeek}</span>
                    </div>
                    <Progress value={progress.percentComplete} className="h-3" />
                    <p className="text-xs text-muted-foreground text-right">
                        {progress.percentComplete.toFixed(1)}% complete
                    </p>
                </div>

                {/* Trimester Badge */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Trimester</span>
                        <Badge className={trimesterInfo.color}>
                            {trimesterInfo.label}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {trimesterInfo.description}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 rounded-lg border p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs">Due Date</span>
                        </div>
                        <p className="text-sm font-semibold">
                            {format(new Date(pregnancy.dueDate), "PPP")}
                        </p>
                    </div>

                    <div className="space-y-1 rounded-lg border p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Heart className="h-4 w-4" />
                            <span className="text-xs">Days Remaining</span>
                        </div>
                        <p className="text-sm font-semibold">
                            {progress.daysRemaining} days
                        </p>
                    </div>
                </div>

                {/* Risk Level */}
                {pregnancy.riskLevel && (
                    <div className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Risk Level</span>
                            <Badge
                                variant={
                                    pregnancy.riskLevel === "HIGH"
                                        ? "destructive"
                                        : pregnancy.riskLevel === "MEDIUM"
                                            ? "default"
                                            : "secondary"
                                }
                            >
                                {pregnancy.riskLevel}
                            </Badge>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
