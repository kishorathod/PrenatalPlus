import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Calendar, Activity, ShieldCheck, Stethoscope } from "lucide-react"
import { getAdminStats, getRecentUsers } from "@/server/actions/admin"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
    const [{ stats }, { users: recentUsers }] = await Promise.all([
        getAdminStats(),
        getRecentUsers()
    ])

    return (
        <div className="container mx-auto px-6 py-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.totalPatients || 0} patients, {stats?.totalDoctors || 0} doctors
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {stats?.pendingVerifications || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Doctors awaiting approval</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.appointmentsToday || 0}</div>
                        <p className="text-xs text-muted-foreground">Scheduled for today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Healthy</div>
                        <p className="text-xs text-muted-foreground">All systems operational</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Registrations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentUsers && recentUsers.length > 0 ? (
                                recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatar || ""} />
                                                <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={
                                                user.role === "ADMIN" ? "default" :
                                                    user.role === "DOCTOR" ? "secondary" : "outline"
                                            }>
                                                {user.role}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">No recent users</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/admin/doctors">
                            <Button className="w-full justify-start h-auto p-4" variant="outline">
                                <ShieldCheck className="h-5 w-5 mr-3 text-orange-500" />
                                <div className="text-left">
                                    <div className="font-semibold">Verify Doctors</div>
                                    <div className="text-xs text-gray-500">Review pending doctor applications</div>
                                </div>
                            </Button>
                        </Link>

                        <Link href="/admin/users">
                            <Button className="w-full justify-start h-auto p-4" variant="outline">
                                <Users className="h-5 w-5 mr-3 text-blue-500" />
                                <div className="text-left">
                                    <div className="font-semibold">Manage Users</div>
                                    <div className="text-xs text-gray-500">View and manage all system users</div>
                                </div>
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
