import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { auth } from "@/server/auth"
import { getDoctorUpcomingAppointments } from "@/server/actions/doctor"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User } from "lucide-react"
import { format } from "date-fns"

export default async function DoctorAppointmentsPage() {
    const session = await auth()
    const { appointments } = await getDoctorUpcomingAppointments()

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Appointments</h1>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Schedule</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {appointments?.map((appt) => (
                                    <div key={appt.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary/10 rounded-lg text-primary">
                                                <span className="text-sm font-semibold">{format(new Date(appt.date), 'MMM')}</span>
                                                <span className="text-2xl font-bold">{format(new Date(appt.date), 'd')}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-lg">{appt.title}</h3>
                                                <div className="flex items-center text-sm text-muted-foreground gap-4">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {format(new Date(appt.date), 'h:mm a')} ({appt.duration} min)
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {appt.user.name}
                                                    </div>
                                                </div>
                                                {appt.location && (
                                                    <div className="flex items-center text-sm text-muted-foreground gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {appt.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant={appt.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                                            {appt.status}
                                        </Badge>
                                    </div>
                                ))}
                                {(!appointments || appointments.length === 0) && (
                                    <p className="text-center text-muted-foreground py-8">No appointments scheduled.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Calendar</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={new Date()}
                                className="rounded-md border"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
