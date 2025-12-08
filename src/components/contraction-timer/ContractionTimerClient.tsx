"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Timer, Play, Square, AlertCircle, Clock } from "lucide-react"
import {
    startContractionSession,
    recordContraction,
    endContractionSession,
    getActiveSession,
    deleteContraction
} from "@/server/actions/contraction-timer"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"

interface ContractionTimerClientProps {
    pregnancyId: string
}

export function ContractionTimerClient({ pregnancyId }: ContractionTimerClientProps) {
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [isTracking, setIsTracking] = useState(false)
    const [contractionStart, setContractionStart] = useState<Date | null>(null)
    const [duration, setDuration] = useState(0)
    const [contractions, setContractions] = useState<any[]>([])
    const [intensity, setIntensity] = useState<"MILD" | "MODERATE" | "STRONG">("MODERATE")
    const [notes, setNotes] = useState("")
    const [pattern, setPattern] = useState<any>(null)
    const { toast } = useToast()

    // Timer for contraction duration
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isTracking && contractionStart) {
            interval = setInterval(() => {
                setDuration(Math.floor((Date.now() - contractionStart.getTime()) / 1000))
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isTracking, contractionStart])

    // Load active session on mount
    useEffect(() => {
        const loadActiveSession = async () => {
            const { session } = await getActiveSession(pregnancyId)
            if (session) {
                setSessionId(session.id)
                setContractions(session.contractions || [])
            }
        }
        loadActiveSession()
    }, [pregnancyId])

    const handleStartSession = async () => {
        const result = await startContractionSession(pregnancyId)
        if (result.success && result.sessionId) {
            setSessionId(result.sessionId)
            toast({ title: "Session Started", description: "Start tracking contractions" })
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" })
        }
    }

    const handleStartContraction = () => {
        setIsTracking(true)
        setContractionStart(new Date())
        setDuration(0)
    }

    const handleStopContraction = async () => {
        if (!sessionId || !contractionStart) return

        setIsTracking(false)
        const result = await recordContraction(sessionId, duration, intensity, notes)

        if (result.success) {
            setContractions(prev => [result.contraction, ...prev])
            setPattern(result.pattern)
            setDuration(0)
            setContractionStart(null)
            setNotes("")

            toast({
                title: "Contraction Recorded",
                description: `Duration: ${duration}s, Intensity: ${intensity}`
            })

            // Alert if labor pattern detected
            if (result.pattern?.shouldAlert) {
                toast({
                    title: "⚠️ Labor Pattern Detected!",
                    description: result.pattern.message,
                    variant: "destructive",
                    duration: 10000
                })
            }
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" })
        }
    }

    const handleEndSession = async () => {
        if (!sessionId) return
        const result = await endContractionSession(sessionId)
        if (result.success) {
            setSessionId(null)
            setContractions([])
            setPattern(null)
            toast({ title: "Session Ended", description: "Contraction tracking stopped" })
        }
    }

    const handleDelete = async (id: string) => {
        const result = await deleteContraction(id)
        if (result.success) {
            setContractions(prev => prev.filter(c => c.id !== id))
            toast({ title: "Deleted", description: "Contraction removed" })
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="space-y-6">
            {/* Pattern Alert */}
            {pattern?.shouldAlert && (
                <Alert variant={pattern.status === "active_labor" ? "destructive" : "default"}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>{pattern.message}</strong>
                        <p className="text-sm mt-1">
                            Average: {pattern.avgInterval} min apart, {pattern.avgDuration}s duration
                        </p>
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Timer className="h-5 w-5 text-purple-500" />
                        Contraction Timer
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!sessionId ? (
                        <Button
                            size="lg"
                            className="w-full h-20 text-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            onClick={handleStartSession}
                        >
                            <Play className="h-6 w-6 mr-3" />
                            Start Tracking Session
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            {/* Timer Display */}
                            <div className="text-center space-y-4">
                                <div className="text-6xl font-bold text-purple-600">
                                    {formatTime(duration)}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {isTracking ? "Contraction in progress..." : "Ready to track"}
                                </div>
                            </div>

                            {/* Intensity Selection */}
                            {!isTracking && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Intensity</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["MILD", "MODERATE", "STRONG"].map((level) => (
                                            <Button
                                                key={level}
                                                variant={intensity === level ? "default" : "outline"}
                                                onClick={() => setIntensity(level as any)}
                                            >
                                                {level}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Start/Stop Button */}
                            {!isTracking ? (
                                <Button
                                    size="lg"
                                    className="w-full h-24 text-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                    onClick={handleStartContraction}
                                >
                                    <Play className="h-8 w-8 mr-3" />
                                    Start Contraction
                                </Button>
                            ) : (
                                <div className="space-y-3">
                                    <Textarea
                                        placeholder="Notes (optional)"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={2}
                                    />
                                    <Button
                                        size="lg"
                                        variant="destructive"
                                        className="w-full h-20 text-xl"
                                        onClick={handleStopContraction}
                                    >
                                        <Square className="h-6 w-6 mr-3" />
                                        Stop Contraction
                                    </Button>
                                </div>
                            )}

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleEndSession}
                            >
                                End Session
                            </Button>
                        </div>
                    )}

                    {/* Guidelines */}
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            When to Go to Hospital
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                            <li>Contractions 5 minutes apart for 1 hour</li>
                            <li>Each contraction lasts 45-60 seconds</li>
                            <li>Water breaks or heavy bleeding</li>
                            <li>Severe pain or unusual symptoms</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Contractions */}
            {contractions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Contractions ({contractions.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {contractions.slice(0, 10).map((c, index) => {
                                const nextContraction = contractions[index + 1]
                                const interval = nextContraction
                                    ? Math.floor((new Date(c.startTime).getTime() - new Date(nextContraction.startTime).getTime()) / 60000)
                                    : null

                                return (
                                    <div key={c.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-semibold">{c.duration}s - {c.intensity}</p>
                                            <p className="text-xs text-gray-500">
                                                {format(new Date(c.startTime), "h:mm a")}
                                                {interval && ` • ${interval} min apart`}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(c.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
