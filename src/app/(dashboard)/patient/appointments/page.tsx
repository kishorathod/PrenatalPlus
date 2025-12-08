import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Plus, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function AppointmentsPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    const appointments = await prisma.appointment.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            doctor: {
                select: {
                    name: true,
                    specialization: true,
                    avatar: true
                }
            }
        },
        orderBy: {
            date: 'asc'
        }
    })

    const upcomingAppointments = appointments.filter(a => new Date(a.date) >= new Date())
    const pastAppointments = appointments.filter(a => new Date(a.date) < new Date())

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
                    <p className="text-gray-600">Manage your prenatal checkups and visits</p>
                </div>
                <Link href="/patient/appointments/book">
                    <Button className="bg-pink-500 hover:bg-pink-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Book New Appointment
                    </Button>
                </Link>
            </div>

            {/* Upcoming Appointments */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-pink-500" />
                    Upcoming Visits
                </h2>

                {upcomingAppointments.length === 0 ? (
                    <Card className="border-dashed border-2 bg-gray-50">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Calendar className="h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No upcoming appointments</p>
                            <p className="text-sm text-gray-400 mb-4">Schedule a checkup to stay on track</p>
                            <Link href="/patient/appointments/book">
                                <Button variant="outline">Schedule Now</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingAppointments.map((appt) => (
                            <Card key={appt.id} className="border-l-4 border-l-pink-500 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="font-bold text-lg text-gray-900">
                                                {format(new Date(appt.date), "MMMM d, yyyy")}
                                            </p>
                                            <div className="flex items-center text-pink-600 font-medium mt-1">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {format(new Date(appt.date), "h:mm a")}
                                            </div>
                                        </div>
                                        <Badge variant={appt.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                                            {appt.status}
                                        </Badge>
                                    </div>

                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <UserIcon className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">Dr. {appt.doctor?.name || "Unknown"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span>Main Clinic, Room 302</span>
                                        </div>
                                        {appt.purpose && (
                                            <div className="bg-gray-50 p-2 rounded text-sm text-gray-600 mt-2">
                                                Reason: {appt.purpose}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 text-gray-500">
                        Past Visits
                    </h2>
                    <div className="space-y-3">
                        {pastAppointments.map((appt) => (
                            <div key={appt.id} className="flex items-center justify-between p-4 bg-white border rounded-lg text-gray-500">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 p-2 rounded-lg">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {format(new Date(appt.date), "MMMM d, yyyy")}
                                        </p>
                                        <p className="text-sm">Dr. {appt.doctor?.name || "Unknown"}</p>
                                    </div>
                                </div>
                                <Badge variant="outline">{appt.status}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
