"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
// Importing specific icons to represent growth stages abstractly
import {
    Baby,
    Sprout,
    Apple,
    Banana,
    Grape,
    CircleDot,
    Egg,
    Shell,
    Citrus
} from "lucide-react"

// Map weeks to Lucide icons that vaguely resemble the size or just growth
const getBabyIcon = (week: number) => {
    if (week < 4) return Sprout
    if (week < 8) return Grape // Blueberry-ish
    if (week < 12) return Citrus // Lime
    if (week < 16) return Apple // Avocado shape-ish (abstract)
    if (week < 20) return Banana
    if (week < 24) return Shell // Corn/Ear shape
    if (week < 28) return Egg // Eggplant (egg shape)
    if (week < 40) return Baby
    return Baby
}

import { getBabySizeText, getWeeklyFact } from "@/lib/pregnancy-helpers"

interface BabyProgressCardProps {
    week: number
}

export function BabyProgressCard({ week }: BabyProgressCardProps) {
    const Icon = getBabyIcon(week)
    const fruitText = getBabySizeText(week)
    const progress = Math.min(100, (week / 40) * 100)
    const trimester = week < 13 ? "1st Trimester" : week < 27 ? "2nd Trimester" : "3rd Trimester"
    const fact = getWeeklyFact(week)

    return (
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50/50 overflow-hidden relative group/card">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl group-hover/card:scale-110 transition-transform duration-700"></div>

            <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium uppercase tracking-wide">
                                {trimester}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">Week {week}</h3>
                        <p className="text-slate-500 text-sm mt-1">Baby is the size of a <span className="font-semibold text-blue-600">{fruitText}</span></p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm text-blue-500 border border-blue-100 animate-in zoom-in duration-500 hover:animate-bounce cursor-pointer hover:text-blue-600 transition-colors">
                        <Icon className="h-8 w-8 group-hover/card:scale-110 transition-transform duration-300" />
                    </div>
                </div>

                <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2.5 bg-blue-100" indicatorClassName="bg-blue-400" />
                </div>

                <div className="mt-5 flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-blue-100/50">
                    <div className="p-1.5 bg-indigo-100 rounded-full mt-0.5">
                        <Baby className="h-3.5 w-3.5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-700">Did you know?</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{fact}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
