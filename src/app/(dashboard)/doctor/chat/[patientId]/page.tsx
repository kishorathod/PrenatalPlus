import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getDoctorConversation, markMessagesAsRead } from "@/server/actions/doctor-chat"
import { getMessages } from "@/server/actions/chat"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { MessageSquare, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
    params: { patientId: string }
}

export default async function DoctorChatRoomPage({ params }: Props) {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        redirect("/login")
    }

    const { conversation, error: convError } = await getDoctorConversation(params.patientId)

    if (convError || !conversation) {
        return (
            <div className="container mx-auto px-6 py-8">
                <Link href="/doctor/chat">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Messages
                    </Button>
                </Link>
                <p className="text-red-500">Conversation not found</p>
            </div>
        )
    }

    // Mark messages as read
    await markMessagesAsRead(conversation.id)

    const { messages } = await getMessages(conversation.id)

    // Transform messages to match ChatInterface expected type
    const transformedMessages = messages?.map(msg => ({
        ...msg,
        sender: {
            ...msg.sender,
            image: msg.sender.avatar
        }
    })) || []

    // Transform conversation for ChatInterface
    const chatConversation = {
        id: conversation.id,
        doctor: {
            name: conversation.patient.name,
            avatar: conversation.patient.avatar,
            specialization: "Patient"
        }
    }

    return (
        <div className="container mx-auto px-6 py-8 max-w-4xl">
            <Link href="/doctor/chat">
                <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Messages
                </Button>
            </Link>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-pink-500" />
                    Chat with {conversation.patient.name || "Patient"}
                </h1>
                <p className="text-gray-600 mt-1">
                    {conversation.patient.email}
                </p>
            </div>

            <ChatInterface
                conversation={chatConversation}
                initialMessages={transformedMessages}
                currentUserId={session.user.id}
            />
        </div>
    )
}
