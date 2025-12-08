import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getAllUsers } from "@/server/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserActions } from "@/components/admin/UserActions"
import { formatDistanceToNow } from "date-fns"

export default async function AdminUsersPage() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login/admin")
    }

    const { users } = await getAllUsers()

    return (
        <div className="container mx-auto px-6 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="h-8 w-8 text-blue-500" />
                        User Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage all system users, roles, and permissions
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="w-64" />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={user.avatar || ""} />
                                            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{user.name}</p>
                                                <Badge variant={
                                                    user.role === "ADMIN" ? "default" :
                                                        user.role === "DOCTOR" ? "secondary" : "outline"
                                                }>
                                                    {user.role}
                                                </Badge>
                                                {user.isVerified && user.role === "DOCTOR" && (
                                                    <Badge variant="secondary" className="h-5 text-[10px] bg-green-100 text-green-700 hover:bg-green-100">
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                        </div>
                                        <UserActions
                                            userId={user.id}
                                            userName={user.name || "User"}
                                            currentRole={user.role}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No users found.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
