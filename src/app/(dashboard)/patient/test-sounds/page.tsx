"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotificationSound } from "@/lib/notification-sound"
import { Volume2, CheckCircle, AlertTriangle, AlertCircle, Info, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function SoundTestPage() {
    const { playSuccess, playWarning, playCritical, playInfo, playMessage } = useNotificationSound()

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Volume2 className="h-8 w-8 text-pink-500" />
                    Notification Sound Test
                </h1>
                <p className="text-gray-600 mt-2">
                    Click the buttons below to test each notification sound
                </p>
                <Link href="/patient/dashboard" className="text-sm text-blue-500 hover:underline">
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="space-y-4">
                {/* Success Sound */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            Success Sound
                        </CardTitle>
                        <CardDescription>
                            Pleasant ascending chime (C5 → E5 → G5)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={playSuccess} className="bg-green-500 hover:bg-green-600">
                            <Volume2 className="mr-2 h-4 w-4" />
                            Play Success Sound
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                            Used for: Vitals saved, appointments booked, successful operations
                        </p>
                    </CardContent>
                </Card>

                {/* Warning Sound */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            Warning Sound
                        </CardTitle>
                        <CardDescription>
                            Attention-grabbing double beep
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={playWarning} className="bg-yellow-500 hover:bg-yellow-600">
                            <Volume2 className="mr-2 h-4 w-4" />
                            Play Warning Sound
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                            Used for: Elevated vitals, health alerts, important reminders
                        </p>
                    </CardContent>
                </Card>

                {/* Critical Sound */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            Critical Alert Sound
                        </CardTitle>
                        <CardDescription>
                            Urgent triple beep
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={playCritical} className="bg-red-500 hover:bg-red-600">
                            <Volume2 className="mr-2 h-4 w-4" />
                            Play Critical Sound
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                            Used for: Critical health alerts, emergency notifications
                        </p>
                    </CardContent>
                </Card>

                {/* Info Sound */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-blue-500" />
                            Info Sound
                        </CardTitle>
                        <CardDescription>
                            Subtle two-tone notification
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={playInfo} className="bg-blue-500 hover:bg-blue-600">
                            <Volume2 className="mr-2 h-4 w-4" />
                            Play Info Sound
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                            Used for: General notifications, updates, reminders
                        </p>
                    </CardContent>
                </Card>

                {/* Message Sound */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-purple-500" />
                            Message Sound
                        </CardTitle>
                        <CardDescription>
                            Quick friendly chime
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={playMessage} className="bg-purple-500 hover:bg-purple-600">
                            <Volume2 className="mr-2 h-4 w-4" />
                            Play Message Sound
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                            Used for: Chat messages, doctor responses
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6 bg-gray-50">
                <CardContent className="p-4">
                    <p className="text-sm text-gray-600">
                        <strong>Note:</strong> These sounds are generated using Web Audio API and don't require any audio files.
                        Make sure your device volume is turned up to hear them!
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
