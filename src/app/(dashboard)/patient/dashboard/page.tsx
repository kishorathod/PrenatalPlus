import Link from "next/link"
import { format } from "date-fns"
import { Calendar, Heart, FileText, Baby } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getPatientDashboardStats } from "@/server/actions/dashboard"
import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { RefreshButton } from "@/components/dashboard/RefreshButton"

export const revalidate = 0 // Always fetch fresh data

export default async function PatientDashboard() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    const { stats, recentActivity } = await getPatientDashboardStats()

    return (
        <div className="container mx-auto px-6 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Welcome back, {session.user.name?.split(' ')[0] || 'there'}! 🌸
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Here's your care overview for this week.</p>
                </div>
                <RefreshButton />
            </div>

            {/* Status Alert */}
            <Alert className="bg-pink-50 border-pink-200">
                <Heart className="h-4 w-4 text-pink-600" />
                <AlertDescription className="text-pink-900">
                    Everything looks good today. Keep up the great care!
                </AlertDescription>
            </Alert>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Appointments */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Appointments</p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {stats?.upcomingAppointments || 0}
                                    </span>
                                    <span className="text-sm text-gray-500">upcoming</span>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Vitals */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Vitals</p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {stats?.totalVitals || 0}
                                    </span>
                                    <span className="text-sm text-gray-500">record{stats?.totalVitals !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            <div className="p-3 bg-pink-50 rounded-lg">
                                <Heart className="h-6 w-6 text-pink-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reports */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Reports</p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {stats?.totalReports || 0}
                                    </span>
                                    <span className="text-sm text-gray-500">report{stats?.totalReports !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <FileText className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pregnancies */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pregnancies</p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {stats?.activePregnancies || 0}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {stats?.activePregnancies ? 'active' : 'none active'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <Baby className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Quick Actions */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Button asChild variant="secondary" className="w-full justify-start h-12 bg-blue-50 hover:bg-blue-100 text-blue-700 border-0">
                                <Link href="/appointments" className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5" />
                                    <span>Schedule appointment</span>
                                </Link>
                            </Button>
                            <Button asChild variant="secondary" className="w-full justify-start h-12 bg-pink-50 hover:bg-pink-100 text-pink-700 border-0">
                                <Link href="/vitals" className="flex items-center gap-3">
                                    <Heart className="h-5 w-5" />
                                    <span>Record vitals</span>
                                </Link>
                            </Button>
                            <Button asChild variant="secondary" className="w-full justify-start h-12 bg-purple-50 hover:bg-purple-100 text-purple-700 border-0">
                                <Link href="/reports" className="flex items-center gap-3">
                                    <FileText className="h-5 w-5" />
                                    <span>Upload report</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {/* Recent Appointments */}
                            {recentActivity?.appointments && recentActivity.appointments.length > 0 ? (
                                recentActivity.appointments.map((appointment) => (
                                    <div key={appointment.id} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
                                        <div className="p-2 bg-blue-100 rounded">
                                            <Calendar className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{appointment.title}</p>
                                            <p className="text-xs text-gray-600 uppercase mt-0.5">{appointment.status}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {format(new Date(appointment.date), "MMM dd, h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-8">
                                    No recent appointments
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
