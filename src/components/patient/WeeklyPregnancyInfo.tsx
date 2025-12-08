"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Baby, Heart, Lightbulb, ChevronLeft, ChevronRight, Scale, Ruler } from "lucide-react"
import { weeklyPregnancyData, type WeeklyInfo } from "@/lib/pregnancy-data"
import { motion, AnimatePresence } from "framer-motion"

interface WeeklyPregnancyInfoProps {
    currentWeek: number
}

export function WeeklyPregnancyInfo({ currentWeek }: WeeklyPregnancyInfoProps) {
    const [selectedWeek, setSelectedWeek] = useState(currentWeek)
    const weekInfo = weeklyPregnancyData.find(w => w.week === selectedWeek)

    const goToPrevWeek = () => {
        const currentIndex = weeklyPregnancyData.findIndex(w => w.week === selectedWeek)
        if (currentIndex > 0) {
            setSelectedWeek(weeklyPregnancyData[currentIndex - 1].week)
        }
    }

    const goToNextWeek = () => {
        const currentIndex = weeklyPregnancyData.findIndex(w => w.week === selectedWeek)
        if (currentIndex < weeklyPregnancyData.length - 1) {
            setSelectedWeek(weeklyPregnancyData[currentIndex + 1].week)
        }
    }

    const getTrimesterColor = (trimester: number) => {
        switch (trimester) {
            case 1: return "bg-blue-100 text-blue-700"
            case 2: return "bg-purple-100 text-purple-700"
            case 3: return "bg-pink-100 text-pink-700"
            default: return "bg-gray-100 text-gray-700"
        }
    }

    if (!weekInfo) {
        return (
            <Card className="border-gray-100">
                <CardContent className="p-12 text-center">
                    <p className="text-gray-500">No information available for week {selectedWeek}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Week Navigator */}
            <Card className="border-gray-100">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToPrevWeek}
                            disabled={selectedWeek === weeklyPregnancyData[0].week}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="text-center">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-gray-900">Week {weekInfo.week}</h2>
                                <Badge className={getTrimesterColor(weekInfo.trimester)}>
                                    Trimester {weekInfo.trimester}
                                </Badge>
                            </div>
                            {selectedWeek === currentWeek && (
                                <Badge className="bg-green-100 text-green-700">Current Week</Badge>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToNextWeek}
                            disabled={selectedWeek === weeklyPregnancyData[weeklyPregnancyData.length - 1].week}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedWeek}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    {/* Baby Size Card */}
                    <Card className="border-none bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-pink-100 text-sm mb-1">Baby is the size of a</p>
                                    <h3 className="text-3xl font-bold">{weekInfo.babySize}</h3>
                                </div>
                                <Baby className="h-16 w-16 opacity-20" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Scale className="h-4 w-4" />
                                        <p className="text-xs text-pink-100">Weight</p>
                                    </div>
                                    <p className="font-semibold">{weekInfo.babyWeight}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Ruler className="h-4 w-4" />
                                        <p className="text-xs text-pink-100">Length</p>
                                    </div>
                                    <p className="font-semibold">{weekInfo.babyLength}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Baby Development */}
                    <Card className="border-gray-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Baby className="h-5 w-5 text-pink-500" />
                                Baby's Development
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {weekInfo.development.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="h-2 w-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-gray-700">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Mother's Changes */}
                    <Card className="border-gray-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-purple-500" />
                                Your Body Changes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {weekInfo.motherChanges.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-gray-700">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Tips */}
                    <Card className="border-gray-100 bg-gradient-to-br from-blue-50 to-purple-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-blue-500" />
                                Tips for This Week
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {weekInfo.tips.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-gray-700">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
