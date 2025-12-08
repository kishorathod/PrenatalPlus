import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getSystemLogs } from "@/server/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, User, Calendar, Info } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default async function SystemLogsPage() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login/admin")
    }

    const { logs } = await getSystemLogs(100)

    return (
        <div className="container mx-auto px-6 py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FileText className="h-8 w-8 text-purple-500" />
                    System Logs
                </h1>
                <p className="text-gray-600 mt-1">
                    Audit trail of administrative actions
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    {logs && logs.length > 0 ? (
                        <div className="space-y-1">
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-500 border-b">
                                <div className="col-span-2">Time</div>
                                <div className="col-span-2">Admin</div>
                                <div className="col-span-3">Action</div>
                                <div className="col-span-4">Details</div>
                                <div className="col-span-1">Type</div>
                            </div>
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="grid grid-cols-12 gap-4 px-4 py-3 text-sm border-b hover:bg-gray-50 transition-colors"
                                >
                                    <div className="col-span-2 flex items-center gap-2 text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-xs">
                                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium truncate">{log.admin.name}</span>
                                    </div>
                                    <div className="col-span-3 flex items-center">
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {log.action}
                                        </Badge>
                                    </div>
                                    <div className="col-span-4 flex items-center text-gray-600">
                                        {log.details || "-"}
                                    </div>
                                    <div className="col-span-1 flex items-center">
                                        {log.targetType && (
                                            <Badge variant="secondary" className="text-xs">
                                                {log.targetType}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Info className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No logs yet
                            </h3>
                            <p className="text-gray-500">
                                System logs will appear here as admins perform actions
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
