"use client"

import { useEffect, useState, useRef } from "react"
import { getMedicationReminders } from "@/server/actions/medications"
import { useToast } from "@/components/ui/use-toast"
import { Bell } from "lucide-react"

type Reminder = {
    id: string
    name: string
    dosage: string
    timeOfDay: string[]
}

export function MedicationReminderManager() {
    const { toast } = useToast()
    const [reminders, setReminders] = useState<Reminder[]>([])
    const lastCheckTime = useRef<string>("")

    // 1. Request Notification Permissions on mount
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission()
        }
    }, [])

    // 2. Fetch Reminders (Initial + Polling every 5 mins to keep synced)
    useEffect(() => {
        const fetchReminders = async () => {
            const { reminders, error } = await getMedicationReminders()
            if (!error && reminders) {
                setReminders(reminders)
            }
        }

        fetchReminders()
        // Poll for database updates every 5 minutes
        const dbPollInterval = setInterval(fetchReminders, 5 * 60 * 1000)

        return () => clearInterval(dbPollInterval)
    }, [])

    // 3. Check for alerts every 30 seconds
    useEffect(() => {
        const checkReminders = () => {
            const now = new Date()
            const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) // "14:30"

            // Avoid duplicate alerts in the same minute
            if (currentTime === lastCheckTime.current) return
            lastCheckTime.current = currentTime

            reminders.forEach(reminder => {
                if (reminder.timeOfDay.includes(currentTime)) {
                    triggerNotification(reminder)
                }
            })
        }

        const timeCheckInterval = setInterval(checkReminders, 30 * 1000)
        return () => clearInterval(timeCheckInterval)
    }, [reminders]) // Re-run if reminders list changes

    const triggerNotification = (reminder: Reminder) => {
        const title = `Time for ${reminder.name}`
        const body = `Take ${reminder.dosage} - Stay healthy!`

        // A. Browser Notification (if allowed)
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, {
                body: body,
                icon: "/logo.png" // Fallback if 404 is fine
            })
        }

        // B. In-App Toast (Always show)
        toast({
            title: title,
            description: body,
            duration: 10000, // Stay longer
            action: (
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bell className="h-4 w-4 text-blue-600" />
                </div>
            )
        })

        // Custom sound effect (optional/simple beep)
        playBeep()
    }

    const playBeep = () => {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
            const oscillator = audioCtx.createOscillator()
            const gainNode = audioCtx.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioCtx.destination)

            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime) // A5
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)

            oscillator.start()
            oscillator.stop(audioCtx.currentTime + 0.5)
        } catch (e) {
            // Ignore audio errors (browser policy might block autoplay)
        }
    }

    // Render nothing (headless component)
    return null
}
