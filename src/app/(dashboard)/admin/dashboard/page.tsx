import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, Building2, Activity, Plus, FileText } from "lucide-react"
import { getSystemStats, getRecentActivity } from "@/server/actions/admin"
import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

export default async function AdminDashboard() {
    // Server-side authorization check
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login/admin")
    }

    const stats = await getSystemStats()
    const { activities } = await getRecentActivity()

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPatients}</div>
                        <p className="text-xs text-muted-foreground">Patients registered</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalDoctors}</div>
                        <p className="text-xs text-muted-foreground">Medical staff</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.appointmentsToday}</div>
                        <p className="text-xs text-muted-foreground">Scheduled for today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Pregnancies</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{stats.activePregnancies}</div>
                        <p className="text-xs text-muted-foreground">Currently tracking</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activities.length > 0 ? (
                                activities.map((activity, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="ml-4 space-y-1 flex-1">
                                            <p className="text-sm font-medium leading-none">{activity.title}</p>
                                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                                        </div>
                                        <div className="ml-auto font-medium text-sm text-muted-foreground">
                                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No recent activity
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Button asChild className="w-full justify-start" variant="outline">
                                <Link href="/admin/doctors">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Doctor
                                </Link>
                            </Button>
                            <Button asChild className="w-full justify-start" variant="outline">
                                <Link href="/admin/patients">
                                    <Users className="mr-2 h-4 w-4" />
                                    View All Patients
                                </Link>
                            </Button>
                            <Button asChild className="w-full justify-start" variant="outline">
                                <Link href="/admin/analytics">
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Analytics
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
