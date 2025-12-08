"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Baby, RotateCcw, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function KickCounter() {
    const [kicks, setKicks] = useState(0)
    const [startTime, setStartTime] = useState<Date | null>(null)
    const [isTracking, setIsTracking] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [recentKicks, setRecentKicks] = useState<Date[]>([])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isTracking && startTime) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isTracking, startTime])

    const startTracking = () => {
        setStartTime(new Date())
        setIsTracking(true)
        setKicks(0)
        setRecentKicks([])
        setElapsedTime(0)
    }

    const recordKick = () => {
        const now = new Date()
        setKicks(prev => prev + 1)
        setRecentKicks(prev => [...prev, now])
    }

    const resetCounter = () => {
        setKicks(0)
        setStartTime(null)
        setIsTracking(false)
        setElapsedTime(0)
        setRecentKicks([])
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const getStatus = () => {
        if (!isTracking) return { text: "Not tracking", color: "bg-gray-100 text-gray-700" }
        if (kicks >= 10) return { text: "Goal reached! ✓", color: "bg-green-100 text-green-700" }
        if (elapsedTime > 7200) return { text: "Contact doctor", color: "bg-red-100 text-red-700" }
        return { text: "Tracking...", color: "bg-blue-100 text-blue-700" }
    }

    return (
        <Card className="border-gray-100">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-pink-100 rounded-xl">
                            <Baby className="h-6 w-6 text-pink-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Kick Counter</CardTitle>
                            <CardDescription>Track your baby's movements</CardDescription>
                        </div>
                    </div>
                    <Badge className={getStatus().color}>
                        {getStatus().text}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                        <strong>Goal:</strong> Feel 10 kicks within 2 hours. If it takes longer, contact your doctor.
                    </p>
                </div>

                {/* Main Counter Display */}
                <div className="text-center py-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={kicks}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.2, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="text-7xl font-bold text-pink-600 mb-2">
                                {kicks}
                            </div>
                            <p className="text-gray-600 text-lg">
                                {kicks === 1 ? 'kick' : 'kicks'} counted
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Timer */}
                {isTracking && (
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    {!isTracking ? (
                        <Button
                            onClick={startTracking}
                            className="col-span-2 bg-pink-500 hover:bg-pink-600 h-14 text-lg"
                        >
                            Start Tracking
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={recordKick}
                                className="bg-pink-500 hover:bg-pink-600 h-14 text-lg"
                                disabled={kicks >= 10}
                            >
                                Record Kick
                            </Button>
                            <Button
                                onClick={resetCounter}
                                variant="outline"
                                className="h-14"
                            >
                                <RotateCcw className="mr-2 h-5 w-5" />
                                Reset
                            </Button>
                        </>
                    )}
                </div>

                {/* Recent Kicks Timeline */}
                {recentKicks.length > 0 && (
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Kicks</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {recentKicks.slice().reverse().map((kickTime, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded p-2"
                                >
                                    <div className="h-2 w-2 bg-pink-500 rounded-full"></div>
                                    <span>Kick #{recentKicks.length - index}</span>
                                    <span className="ml-auto text-xs">
                                        {kickTime.toLocaleTimeString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
