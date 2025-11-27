"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Appointment } from "@/types/appointment.types" // Assuming this type exists, or I'll define it locally if needed or import from prisma
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Clock, User as UserIcon, Calendar as CalendarIcon } from "lucide-react"

// Temporary type definition if not found, but I should check types first.
// I'll assume standard Appointment type from Prisma for now.
interface AppointmentWithDetails {
    id: string
    title: string
    date: string | Date
    type: string
    doctorName?: string | null
    location?: string | null
    status: string
}

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch("/api/appointments")
                if (response.ok) {
                    const data = await response.json()
                    setAppointments(data.appointments || [])
                }
            } catch (error) {
                console.error("Failed to fetch appointments:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAppointments()
    }, [])

    // Filter appointments for the selected date
    const selectedDateAppointments = appointments.filter((apt) => {
        if (!date) return false
        const aptDate = new Date(apt.date)
        return (
            aptDate.getDate() === date.getDate() &&
            aptDate.getMonth() === date.getMonth() &&
            aptDate.getFullYear() === date.getFullYear()
        )
    })

    // Get days with appointments for modifiers
    const daysWithAppointments = appointments.map((apt) => new Date(apt.date))

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Calendar</h1>
                <p className="text-muted-foreground mt-2">
                    View your upcoming appointments and events
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[auto_1fr]">
                <Card className="w-fit h-fit">
                    <CardContent className="p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                            modifiers={{
                                booked: daysWithAppointments,
                            }}
                            modifiersStyles={{
                                booked: {
                                    fontWeight: "bold",
                                    textDecoration: "underline",
                                    color: "var(--primary)",
                                },
                            }}
                        />
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>
                            {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            {selectedDateAppointments.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedDateAppointments.map((apt) => (
                                        <div
                                            key={apt.id}
                                            className="flex items-start justify-between p-4 border rounded-lg"
                                        >
                                            <div className="space-y-1">
                                                <h4 className="font-semibold">{apt.title}</h4>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    {format(new Date(apt.date), "h:mm a")}
                                                </div>
                                                {apt.doctorName && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <UserIcon className="mr-2 h-4 w-4" />
                                                        {apt.doctorName}
                                                    </div>
                                                )}
                                                {apt.location && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <MapPin className="mr-2 h-4 w-4" />
                                                        {apt.location}
                                                    </div>
                                                )}
                                            </div>
                                            <Badge variant={apt.status === "CONFIRMED" ? "default" : "secondary"}>
                                                {apt.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                                    <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
                                    <p>No appointments for this day</p>
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
