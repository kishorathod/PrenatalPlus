import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Activity, ClipboardList, AlertTriangle, Clock } from "lucide-react"
import { getDoctorStats, getDoctorUpcomingAppointments, getHighRiskPatients } from "@/server/actions/doctor"
import { getRecentActivity, getPendingTasks } from "@/server/actions/doctor-dashboard"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { RecentActivityTimeline } from "@/components/doctor/RecentActivityTimeline"
import { QuickActionsPanel } from "@/components/doctor/QuickActionsPanel"
import { PendingTasksWidget } from "@/components/doctor/PendingTasksWidget"

export default async function DoctorDashboard() {
    // Server-side authorization check
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        redirect("/login?role=doctor")
    }

    const [
        { stats },
        { appointments },
        { patients: highRiskPatients },
        { activities },
        { tasks }
    ] = await Promise.all([
        getDoctorStats(),
        getDoctorUpcomingAppointments(),
        getHighRiskPatients(),
        getRecentActivity(),
        getPendingTasks()
    ])

    const todayAppointments = appointments?.filter(apt => {
        const aptDate = new Date(apt.date)
        const today = new Date()
        return aptDate.toDateString() === today.toDateString()
    }) || []

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalPatients || 0}</div>
                        <p className="text-xs text-muted-foreground">Active patients</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.todayAppointments || 0}</div>
                        <p className="text-xs text-muted-foreground">{todayAppointments.length} upcoming</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">High Risk Alerts</CardTitle>
                        <Activity className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{stats?.highRiskCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{appointments?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Next 7 days</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Upcoming Appointments</CardTitle>
                        <Link href="/doctor/appointments">
                            <Button variant="outline" size="sm">View All</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {todayAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {todayAppointments.slice(0, 5).map((appointment) => (
                                    <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.patient.email}`} />
                                                <AvatarFallback>{appointment.patient.name?.[0] || "P"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{appointment.patient.name}</p>
                                                <p className="text-sm text-muted-foreground">{appointment.title || "General Checkup"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">
                                                {new Date(appointment.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <Badge variant={appointment.status === "COMPLETED" ? "default" : appointment.status === "CANCELLED" ? "destructive" : "secondary"}>
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">No appointments scheduled for today.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>High-Risk Patients</CardTitle>
                        <Link href="/doctor/patients">
                            <Button variant="outline" size="sm">View All</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {highRiskPatients && highRiskPatients.length > 0 ? (
                            <div className="space-y-4">
                                {highRiskPatients.slice(0, 5).map((patient: any) => {
                                    const latestVital = patient.vitalReadings?.[0]
                                    const pregnancy = patient.pregnancies?.[0]
                                    return (
                                        <Link key={patient.id} href={`/doctor/patients/${patient.id}`}>
                                            <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <span className="relative flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                    </span>
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.email}`} />
                                                        <AvatarFallback>{patient.name?.[0] || "P"}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{patient.name}</p>
                                                    <p className="text-xs text-muted-foreground">Week {pregnancy?.currentWeek || "N/A"}</p>
                                                    {latestVital && (
                                                        <p className="text-xs text-red-600 mt-1">
                                                            BP: {latestVital.systolic}/{latestVital.diastolic}
                                                        </p>
                                                    )}
                                                </div>
                                                <Badge variant="destructive" className="shrink-0">HIGH RISK</Badge>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <AlertTriangle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">No high-risk patients</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Second Row - Quick Actions, Pending Tasks, and Recent Activity */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <QuickActionsPanel />
                    </CardContent>
                </Card>

                {/* Pending Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tasks ? (
                            <PendingTasksWidget tasks={tasks} />
                        ) : (
                            <p className="text-sm text-gray-500">Loading tasks...</p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentActivityTimeline activities={activities || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
