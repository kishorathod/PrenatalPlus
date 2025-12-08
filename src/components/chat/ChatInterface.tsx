"use client"

import { useEffect, useState, useRef } from "react"
import { pusher } from "@/lib/pusher"
import { MessageBubble } from "./MessageBubble"
import { ChatInput } from "./ChatInput"
import { sendMessage } from "@/server/actions/chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface User {
    id: string
    name: string | null
    image: string | null
    role: "PATIENT" | "DOCTOR" | "ADMIN"
}

interface Message {
    id: string
    content: string
    senderId: string
    createdAt: Date | string
    sender: User
}

interface Conversation {
    id: string
    doctor: {
        name: string | null
        avatar: string | null
        specialization: string | null
    }
}

interface ChatInterfaceProps {
    conversation: Conversation
    initialMessages: Message[]
    currentUserId: string
}

export function ChatInterface({ conversation, initialMessages, currentUserId }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Scroll to bottom on mount and new messages
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    useEffect(() => {
        if (!pusher) return

        const channel = pusher.subscribe(`conversation-${conversation.id}`)

        channel.bind("new-message", (message: Message) => {
            // Skip messages from current user (we already added them optimistically)
            if (message.senderId === currentUserId) return

            // Only append if not already in list
            setMessages((prev) => {
                if (prev.find(m => m.id === message.id)) return prev
                return [...prev, message]
            })
        })

        return () => {
            pusher?.unsubscribe(`conversation-${conversation.id}`)
        }
    }, [conversation.id, currentUserId])

    const handleSend = async (content: string) => {
        // Optimistic update
        const tempId = Math.random().toString()
        const optimisticMessage: Message = {
            id: tempId,
            content,
            senderId: currentUserId,
            createdAt: new Date(),
            sender: {
                id: currentUserId,
                name: "Me", // Placeholder
                image: null,
                role: "PATIENT"
            }
        }

        setMessages(prev => [...prev, optimisticMessage])

        const result = await sendMessage(conversation.id, content)

        if (result.error) {
            // Remove optimistic message on error
            setMessages(prev => prev.filter(m => m.id !== tempId))
            console.error(result.error)
        } else if (result.message) {
            // Replace optimistic message with real one
            setMessages(prev => prev.map(m => m.id === tempId ? result.message as any : m))
        }
    }

    return (
        <Card className="flex flex-col h-[600px] shadow-lg border-0 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-pink-50 flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={conversation.doctor.avatar || ""} />
                    <AvatarFallback className="bg-pink-200 text-pink-700">
                        {conversation.doctor.name?.charAt(0) || "D"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold text-gray-900">Dr. {conversation.doctor.name}</h3>
                    <p className="text-xs text-gray-500">{conversation.doctor.specialization || "Obstetrician"}</p>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-gray-50/50">
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-20">
                            <p>No messages yet.</p>
                            <p className="text-sm">Start a conversation with Dr. {conversation.doctor.name}</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                isCurrentUser={msg.senderId === currentUserId}
                            />
                        ))
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <ChatInput onSend={handleSend} />
        </Card>
    )
}
