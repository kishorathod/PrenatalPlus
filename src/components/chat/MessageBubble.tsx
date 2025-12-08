"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

interface Message {
    id: string
    content: string
    senderId: string
    createdAt: Date | string
    sender?: {
        name?: string | null
        avatar?: string | null
        image?: string | null  // Support both for compatibility
        role?: "PATIENT" | "DOCTOR" | "ADMIN"
    } | null
}

interface MessageBubbleProps {
    message: Message
    isCurrentUser: boolean
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
    // Handle both avatar and image fields, with null safety
    const senderAvatar = message.sender?.avatar || message.sender?.image || ""
    const senderName = message.sender?.name || (isCurrentUser ? "You" : "Doctor")

    return (
        <div className={cn(
            "flex w-full gap-2 mb-4",
            isCurrentUser ? "justify-end" : "justify-start"
        )}>
            {!isCurrentUser && (
                <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={senderAvatar} />
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                        {senderName.charAt(0) || "D"}
                    </AvatarFallback>
                </Avatar>
            )}

            <div className={cn(
                "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
                isCurrentUser
                    ? "bg-pink-500 text-white rounded-tr-none"
                    : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
            )}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={cn(
                    "text-[10px] mt-1 opacity-70",
                    isCurrentUser ? "text-pink-100" : "text-gray-400"
                )}>
                    {format(new Date(message.createdAt), "h:mm a")}
                </p>
            </div>

            {isCurrentUser && (
                <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={senderAvatar} />
                    <AvatarFallback className="bg-pink-100 text-pink-700">
                        {senderName.charAt(0) || "P"}
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}
