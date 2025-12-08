"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { AIChatInterface } from "@/components/chat/ai/AIChatInterface"
import { MessageSquare, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ChatPageContentProps {
    conversation: any
    initialMessages: any[]
    currentUserId: string
    doctorName?: string
}

export function ChatPageContent({
    conversation,
    initialMessages,
    currentUserId,
    doctorName
}: ChatPageContentProps) {
    return (
        <div className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600 mt-1">
                    Chat with your doctor or get instant answers from our AI assistant.
                </p>
            </div>

            <Tabs defaultValue="doctor" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-6">
                    <TabsTrigger value="doctor" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Doctor Chat
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        Prenatal AI
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="doctor" className="space-y-4">
                    {conversation ? (
                        <ChatInterface
                            conversation={conversation}
                            initialMessages={initialMessages}
                            currentUserId={currentUserId}
                        />
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <MessageSquare className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Doctor Assigned</h3>
                                <p className="text-gray-500 max-w-sm">
                                    You need to be assigned to a doctor before you can chat with them.
                                    Please contact your clinic administrator.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="ai">
                    <AIChatInterface />
                </TabsContent>
            </Tabs>
        </div>
    )
}
