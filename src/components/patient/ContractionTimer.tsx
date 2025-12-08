"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Timer, Play, Square, Trash2, AlertTriangle } from "lucide-react"

interface Contraction {
    startTime: Date
    endTime?: Date
    duration?: number
}

export function ContractionTimer() {
    const [contractions, setContractions] = useState<Contraction[]>([])
    const [currentContraction, setCurrentContraction] = useState<Contraction | null>(null)
    const [elapsedTime, setElapsedTime] = useState(0)

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (currentContraction && !currentContraction.endTime) {
            interval = setInterval(() => {
                setElapsedTime(
                    Math.floor((new Date().getTime() - currentContraction.startTime.getTime()) / 1000)
                )
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [currentContraction])

    const startContraction = () => {
        const newContraction: Contraction = {
            startTime: new Date()
        }
        setCurrentContraction(newContraction)
        setElapsedTime(0)
    }

    const endContraction = () => {
        if (currentContraction) {
            const endTime = new Date()
            const duration = Math.floor((endTime.getTime() - currentContraction.startTime.getTime()) / 1000)
            const completedContraction = {
                ...currentContraction,
                endTime,
                duration
            }
            setContractions(prev => [completedContraction, ...prev])
            setCurrentContraction(null)
            setElapsedTime(0)
        }
    }

    const clearHistory = () => {
        setContractions([])
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getTimeBetween = (index: number) => {
        if (index >= contractions.length - 1) return null
        const current = contractions[index]
        const previous = contractions[index + 1]
        if (!current.startTime || !previous.endTime) return null
        const diff = Math.floor((current.startTime.getTime() - previous.endTime.getTime()) / 1000)
        return formatTime(diff)
    }

    const getAverageFrequency = () => {
        if (contractions.length < 2) return null
        let totalGap = 0
        let count = 0
        for (let i = 0; i < contractions.length - 1; i++) {
            const gap = getTimeBetween(i)
            if (gap) {
                const [mins, secs] = gap.split(':').map(Number)
                totalGap += mins * 60 + secs
                count++
            }
        }
        return count > 0 ? formatTime(Math.floor(totalGap / count)) : null
    }

    const shouldAlert = () => {
        if (contractions.length < 3) return false
        const avgFreq = getAverageFrequency()
        if (!avgFreq) return false
        const [mins] = avgFreq.split(':').map(Number)
        return mins <= 5 // Alert if contractions are 5 minutes or less apart
    }

    return (
        <Card className="border-gray-100">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <Timer className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Contraction Timer</CardTitle>
                            <CardDescription>Track labor contractions</CardDescription>
                        </div>
                    </div>
                    {contractions.length > 0 && (
                        <Badge className="bg-purple-100 text-purple-700">
                            {contractions.length} recorded
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Alert for frequent contractions */}
                {shouldAlert() && (
                    <Alert className="bg-red-50 border-red-200">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-900 font-medium">
                            Contractions are 5 minutes or less apart. Consider contacting your doctor or heading to the hospital.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Timer Display */}
                <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-6xl font-bold font-mono text-purple-600 mb-2">
                        {formatTime(elapsedTime)}
                    </div>
                    <p className="text-gray-600">
                        {currentContraction ? 'Contraction in progress...' : 'Ready to track'}
                    </p>
                </div>

                {/* Control Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    {!currentContraction ? (
                        <Button
                            onClick={startContraction}
                            className="col-span-2 bg-purple-500 hover:bg-purple-600 h-14 text-lg"
                        >
                            <Play className="mr-2 h-5 w-5" />
                            Start Contraction
                        </Button>
                    ) : (
                        <Button
                            onClick={endContraction}
                            className="col-span-2 bg-pink-500 hover:bg-pink-600 h-14 text-lg"
                        >
                            <Square className="mr-2 h-5 w-5" />
                            End Contraction
                        </Button>
                    )}
                </div>

                {/* Statistics */}
                {contractions.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Total Contractions</p>
                            <p className="text-2xl font-bold text-gray-900">{contractions.length}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Avg. Frequency</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {getAverageFrequency() || '--:--'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Contraction History */}
                {contractions.length > 0 && (
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-700">History</h4>
                            <Button
                                onClick={clearHistory}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Clear
                            </Button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {contractions.map((contraction, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {contraction.startTime.toLocaleTimeString()}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            Duration: {formatTime(contraction.duration || 0)}
                                        </p>
                                    </div>
                                    {getTimeBetween(index) && (
                                        <Badge variant="outline" className="text-xs">
                                            {getTimeBetween(index)} apart
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
