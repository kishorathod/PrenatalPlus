"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Baby, Play, Square, TrendingUp, AlertCircle } from "lucide-react"
import { startKickSession, recordKick, endKickSession, getActiveKickSession } from "@/server/actions/kick-counter"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface KickCounterClientProps {
    pregnancyId: string
    currentWeek: number
}

export function KickCounterClient({ pregnancyId, currentWeek }: KickCounterClientProps) {
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [kickCount, setKickCount] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [notes, setNotes] = useState("")
    const { toast } = useToast()

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isActive) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isActive])

    // Check for active session on mount
    useEffect(() => {
        const checkActiveSession = async () => {
            const { session } = await getActiveKickSession(pregnancyId)
            if (session) {
                setSessionId(session.id)
                setKickCount(session.count)
                setIsActive(true)
                const elapsed = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000)
                setDuration(elapsed)
            }
        }
        checkActiveSession()
    }, [pregnancyId])

    const handleStart = async () => {
        const result = await startKickSession(pregnancyId)
        if (result.success && result.sessionId) {
            setSessionId(result.sessionId)
            setIsActive(true)
            setKickCount(0)
            setDuration(0)
            toast({ title: "Session Started", description: "Tap the button each time you feel a kick!" })
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" })
        }
    }

    const handleKick = async () => {
        if (!sessionId) return
        const result = await recordKick(sessionId)
        if (result.success && result.count !== undefined) {
            setKickCount(result.count)
        }
    }

    const handleEnd = async () => {
        if (!sessionId) return
        const result = await endKickSession(sessionId, notes)
        if (result.success) {
            setIsActive(false)
            setSessionId(null)
            toast({
                title: "Session Completed",
                description: `Recorded ${kickCount} kicks in ${Math.floor(duration / 60)} minutes.`
            })
            setKickCount(0)
            setDuration(0)
            setNotes("")
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" })
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="space-y-6">
            {currentWeek < 28 && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Kick counting is typically recommended after week 28. You're currently at week {currentWeek}.
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Baby className="h-5 w-5 text-pink-500" />
                        Kick Counter
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Counter Display */}
                    <div className="text-center space-y-4">
                        <div className="text-6xl font-bold text-pink-600">{kickCount}</div>
                        <div className="text-sm text-gray-500">kicks recorded</div>
                        <div className="text-2xl font-mono text-gray-700">{formatTime(duration)}</div>
                    </div>

                    {/* Tap Button */}
                    {isActive ? (
                        <div className="space-y-4">
                            <Button
                                size="lg"
                                className="w-full h-32 text-2xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                                onClick={handleKick}
                            >
                                <Baby className="h-8 w-8 mr-3" />
                                Tap for Each Kick
                            </Button>

                            <Textarea
                                placeholder="Add notes (optional)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={2}
                            />

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleEnd}
                            >
                                <Square className="h-4 w-4 mr-2" />
                                End Session
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="lg"
                            className="w-full h-20 text-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                            onClick={handleStart}
                        >
                            <Play className="h-6 w-6 mr-3" />
                            Start Counting
                        </Button>
                    )}

                    {/* Guidelines */}
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Guidelines
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                            <li>Count kicks when baby is most active (usually after meals)</li>
                            <li>You should feel at least 10 movements in 2 hours</li>
                            <li>Contact your doctor if movements decrease significantly</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
