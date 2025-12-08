"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { sendAIMessage, getOrCreateAIChatSession, clearChatHistory } from "@/server/actions/ai-chat"
import { SafetyDisclaimer } from "./SafetyDisclaimer"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Message {
    id: string
    role: "USER" | "ASSISTANT" | "SYSTEM"
    content: string
    createdAt: Date
}

export function AIChatInterface() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()

    useEffect(() => {
        loadSession()
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const loadSession = async () => {
        try {
            const { session, error } = await getOrCreateAIChatSession()
            if (session) {
                console.log("Session loaded:", session.id)
                setSessionId(session.id)
                setMessages(session.messages as unknown as Message[])
            } else if (error) {
                console.error("Session load error:", error)
                toast({ title: "Error", description: error, variant: "destructive" })
            }
        } catch (e) {
            console.error("Critical session load error:", e)
        }
    }

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        if (!sessionId) {
            toast({
                title: "Connection Error",
                description: "Chat session not initialized. Please refresh the page.",
                variant: "destructive"
            })
            return
        }

        const userMsg: Message = {
            id: "temp-" + Date.now(),
            role: "USER",
            content: input,
            createdAt: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            const result = await sendAIMessage(sessionId, userMsg.content)

            if (result.success && result.message) {
                // Replace temp message if needed, but for now just appending AI response works 
                // because we updated local state. A real sync would be better but this is fine for now.
                // Actually, let's append the AI message.
                setMessages(prev => [...prev, result.message as unknown as Message])
            } else {
                toast({ title: "Error settings message", description: result.error, variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to send message", variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleClearChat = async () => {
        if (!sessionId) return
        const result = await clearChatHistory(sessionId)
        if (result.success) {
            setMessages([])
            setSessionId(null)
            loadSession() // Start new
            toast({ title: "Chat Cleared", description: "Started a new conversation" })
        }
    }

    return (
        <div className="flex flex-col h-[600px] border rounded-lg bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                        <Bot className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            Prenatal Assistant
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">AI</span>
                        </h3>
                        <p className="text-xs text-gray-500">Usually replies instantly</p>
                    </div>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                            Clear Chat
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Start New Conversation?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will clear your current chat history. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearChat}>Clear Chat</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-gray-50/50">
                <SafetyDisclaimer />

                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center py-10 text-gray-500 space-y-4">
                            <Sparkles className="h-12 w-12 mx-auto text-purple-300" />
                            <p>Hi! I'm your Prenatal Assistant.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm max-w-md mx-auto">
                                <button onClick={() => setInput("Is nausea normal in week 8?")} className="p-2 bg-white border rounded-lg hover:bg-purple-50 text-left">
                                    "Is nausea normal in week 8?"
                                </button>
                                <button onClick={() => setInput("What foods should I avoid?")} className="p-2 bg-white border rounded-lg hover:bg-purple-50 text-left">
                                    "What foods should I avoid?"
                                </button>
                                <button onClick={() => setInput("Explain round ligament pain")} className="p-2 bg-white border rounded-lg hover:bg-purple-50 text-left">
                                    "Explain round ligament pain"
                                </button>
                                <button onClick={() => setInput("Show me my appointments")} className="p-2 bg-white border rounded-lg hover:bg-purple-50 text-left">
                                    "Show me my appointments"
                                </button>
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => {
                        const isUser = msg.role === "USER"
                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    isUser ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                                    isUser ? "bg-pink-100 border-pink-200" : "bg-purple-100 border-purple-200"
                                )}>
                                    {isUser ? (
                                        <User className="h-4 w-4 text-pink-600" />
                                    ) : (
                                        <Bot className="h-4 w-4 text-purple-600" />
                                    )}
                                </div>

                                <div className={cn(
                                    "p-3 rounded-2xl text-sm shadow-sm",
                                    isUser
                                        ? "bg-pink-500 text-white rounded-tr-none"
                                        : "bg-white border text-gray-800 rounded-tl-none"
                                )}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    <p className={cn(
                                        "text-[10px] mt-1 opacity-70",
                                        isUser ? "text-pink-100" : "text-gray-400"
                                    )}>
                                        {format(new Date(msg.createdAt), "h:mm a")}
                                    </p>
                                </div>
                            </div>
                        )
                    })}

                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
                                <Bot className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="bg-white border p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                                <span className="text-xs text-gray-500">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSend()
                    }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your pregnancy..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
                <p className="text-[10px] text-center text-gray-400 mt-2">
                    AI can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    )
}
