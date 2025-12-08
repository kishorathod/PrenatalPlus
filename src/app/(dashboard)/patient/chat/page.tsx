import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getConversation, getMessages } from "@/server/actions/chat"
import { ChatPageContent } from "@/components/chat/ChatPageContent"

export default async function ChatPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    // Try to get doctor conversation, but don't error if not found (so AI chat still works)
    let conversation = null
    let messages: any[] = []

    try {
        const result = await getConversation()
        if (result.conversation) {
            conversation = result.conversation
            const msgResult = await getMessages(conversation.id)
            messages = msgResult.messages || []
        }
    } catch (error) {
        console.error("Error fetching doctor chat:", error)
        // Swallow error to allow AI chat to load
    }

    return (
        <ChatPageContent
            conversation={conversation}
            initialMessages={messages}
            currentUserId={session.user.id!}
        />
    )
}
