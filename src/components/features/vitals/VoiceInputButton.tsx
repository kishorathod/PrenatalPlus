"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface VoiceInputButtonProps {
    onResult: (text: string) => void
    isProcessing?: boolean
}

export function VoiceInputButton({ onResult, isProcessing }: VoiceInputButtonProps) {
    const [isListening, setIsListening] = useState(false)
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        if (typeof window !== "undefined") {
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (SpeechRecognition) {
                const reco = new SpeechRecognition()
                reco.continuous = false
                reco.interimResults = false
                reco.lang = "en-US"
                setRecognition(reco)
            }
        }
    }, [])

    const toggleListening = useCallback(() => {
        if (!recognition) {
            toast({
                title: "Not Supported",
                description: "Voice input is not supported in this browser.",
                variant: "destructive"
            })
            return
        }

        if (isListening) {
            recognition.stop()
            setIsListening(false)
        } else {
            try {
                recognition.start()
                setIsListening(true)

                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    const transcript = event.results[0][0].transcript
                    console.log("Voice result:", transcript)
                    onResult(transcript)
                    setIsListening(false)
                }

                recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error("Speech recognition error", event.error)
                    setIsListening(false)
                    if (event.error === 'not-allowed') {
                        toast({
                            title: "Permission Denied",
                            description: "Please allow microphone access to use voice input.",
                            variant: "destructive"
                        })
                    }
                }

                recognition.onend = () => {
                    setIsListening(false)
                }
            } catch (err) {
                console.error(err)
                setIsListening(false)
            }
        }
    }, [isListening, recognition, onResult, toast])

    if (!recognition) return null

    return (
        <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            className={cn(
                "transition-all duration-200 gap-2",
                isListening && "animate-pulse"
            )}
            onClick={toggleListening}
        >
            {isListening ? (
                <>
                    <MicOff className="h-4 w-4" />
                    Listening...
                </>
            ) : (
                <>
                    <Mic className="h-4 w-4 text-blue-500" />
                    Voice Input
                </>
            )}
        </Button>
    )
}
