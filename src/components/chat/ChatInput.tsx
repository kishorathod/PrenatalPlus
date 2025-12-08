"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"

interface ChatInputProps {
    onSend: (content: string) => Promise<void>
    disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [content, setContent] = useState("")
    const [isSending, setIsSending] = useState(false)

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!content.trim() || isSending || disabled) return

        setIsSending(true)
        try {
            await onSend(content)
            setContent("")
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-white">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="min-h-[50px] max-h-[150px] resize-none"
                disabled={disabled || isSending}
            />
            <Button
                type="submit"
                size="icon"
                className="h-[50px] w-[50px] bg-pink-500 hover:bg-pink-600 shrink-0"
                disabled={!content.trim() || disabled || isSending}
            >
                {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Send className="h-5 w-5" />
                )}
            </Button>
        </form>
    )
}
