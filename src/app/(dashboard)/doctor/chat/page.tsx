import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getDoctorConversations } from "@/server/actions/doctor-chat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default async function DoctorChatPage() {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        redirect("/login")
    }

    const { conversations, error } = await getDoctorConversations()

    if (error) {
        return (
            <div className="container mx-auto px-6 py-8">
                <p className="text-red-500">Failed to load conversations</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-pink-500" />
                    Patient Messages
                </h1>
                <p className="text-gray-600 mt-1">
                    View and respond to messages from your patients
                </p>
            </div>

            {!conversations || conversations.length === 0 ? (
                <Card className="border-dashed border-2 bg-gray-50">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No conversations yet</p>
                        <p className="text-sm text-gray-400">
                            Patients will appear here when they message you
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {conversations.map((conv) => (
                        <Link key={conv.id} href={`/doctor/chat/${conv.patient.id}`}>
                            <Card className="hover:border-pink-200 hover:shadow-md transition-all cursor-pointer">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={conv.patient.avatar || ""} />
                                        <AvatarFallback className="bg-pink-100 text-pink-700">
                                            {conv.patient.name?.charAt(0) || "P"}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">
                                                {conv.patient.name || "Patient"}
                                            </h3>
                                            {conv.unreadCount > 0 && (
                                                <Badge className="bg-pink-500 text-white">
                                                    {conv.unreadCount} new
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">
                                            {conv.messages[0]?.content || "No messages yet"}
                                        </p>
                                    </div>

                                    <div className="text-xs text-gray-400">
                                        {conv.messages[0]?.createdAt &&
                                            formatDistanceToNow(new Date(conv.messages[0].createdAt), { addSuffix: true })
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
