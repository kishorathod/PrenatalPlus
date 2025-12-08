"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Baby, Calendar, Info } from "lucide-react"
import { motion } from "framer-motion"

interface PregnancyProgressProps {
    currentWeek: number
    dueDate: Date
}

export function PregnancyProgress({ currentWeek, dueDate }: PregnancyProgressProps) {
    // Calculate trimester
    const trimester = currentWeek <= 12 ? 1 : currentWeek <= 26 ? 2 : 3
    const progress = Math.min((currentWeek / 40) * 100, 100)

    // Baby size mapping (simplified)
    const getBabySize = (week: number) => {
        if (week < 4) return "Poppy Seed"
        if (week < 8) return "Blueberry"
        if (week < 12) return "Lime"
        if (week < 16) return "Avocado"
        if (week < 20) return "Banana"
        if (week < 24) return "Ear of Corn"
        if (week < 28) return "Eggplant"
        if (week < 32) return "Squash"
        if (week < 36) return "Honeydew"
        return "Watermelon"
    }

    const daysUntilDue = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    return (
        <Card className="border-none shadow-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Baby className="w-64 h-64 transform -rotate-12" />
            </div>

            <CardHeader className="relative z-10 pb-2">
                <CardTitle className="text-lg font-medium text-pink-100 flex items-center gap-2">
                    <Baby className="h-5 w-5" />
                    Pregnancy Progress
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-bold font-heading">{currentWeek} Weeks</h2>
                        <p className="text-pink-100 mt-1">Trimester {trimester}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-pink-100 mb-1">Baby is the size of a</p>
                        <p className="text-2xl font-bold text-white">{getBabySize(currentWeek)}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-pink-100 font-medium">
                        <span>Week 1</span>
                        <span>Week 20</span>
                        <span>Week 40</span>
                    </div>
                    <Progress value={progress} className="h-3 bg-white/20" indicatorClassName="bg-white" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full">
                            <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-pink-100">Due Date</p>
                            <p className="font-semibold">{new Date(dueDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full">
                            <Info className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-pink-100">Days Left</p>
                            <p className="font-semibold">{daysUntilDue} Days</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
