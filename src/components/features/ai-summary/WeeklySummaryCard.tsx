"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, RefreshCw } from "lucide-react"
import { generateWeeklySummary } from "@/server/actions/ai-summary"
import ReactMarkdown from "react-markdown"

export function WeeklySummaryCard() {
    const [summary, setSummary] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGenerate = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await generateWeeklySummary()
            if (result.error) {
                setError(result.error)
            } else if (result.summary) {
                setSummary(result.summary)
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-none shadow-sm bg-gradient-to-r from-rose-50 via-pink-50/30 to-rose-50 overflow-hidden rounded-3xl relative">
            {/* Faint Background Graphic */}
            <div className="absolute -right-6 -bottom-6 opacity-[0.03] pointer-events-none transform rotate-12">
                <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor" className="text-rose-900">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
            </div>

            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-rose-700">
                        <div className="p-1.5 bg-white/60 rounded-lg shadow-sm animate-in zoom-in duration-300">
                            <Sparkles className="h-4 w-4 text-rose-500" />
                        </div>
                        Weekly Health Insight
                    </CardTitle>
                    <CardDescription className="text-rose-900/60 font-medium">
                        AI-powered analysis of your recent vitals.
                    </CardDescription>
                </div>
                {summary && (
                    <Button variant="ghost" size="icon" onClick={handleGenerate} disabled={isLoading} className="text-rose-400 hover:text-rose-600 hover:bg-rose-100/50">
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                )}
            </CardHeader>
            <CardContent className="relative z-10">
                {!summary && !isLoading && !error && (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <p className="text-rose-900/60 text-xs font-medium">
                            Use AI to generate your weekly health report.
                        </p>
                        <Button
                            onClick={handleGenerate}
                            className="bg-white text-rose-600 border border-rose-200 shadow-sm hover:bg-rose-50 transition-all font-semibold rounded-xl"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Report
                        </Button>
                    </div>
                )}

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-3">
                        <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
                        <p className="text-sm text-rose-900/60 animate-pulse font-medium">Analyzing your health data...</p>
                    </div>
                )}

                {error && (
                    <div className="p-4 rounded-xl bg-white/50 border border-rose-100 text-rose-600 text-sm text-center font-medium">
                        {error}
                        <Button variant="link" size="sm" onClick={handleGenerate} className="block mx-auto mt-2 text-rose-500">
                            Try Again
                        </Button>
                    </div>
                )}

                {summary && !isLoading && (
                    <div className="space-y-4">
                        <div className="bg-white/60 p-4 rounded-2xl border border-rose-100/50 text-slate-700 text-sm leading-relaxed shadow-sm">
                            <ReactMarkdown
                                components={{
                                    strong: ({ node, ...props }) => <span className="font-semibold text-rose-700" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-1 marker:text-rose-300" {...props} />
                                }}
                            >
                                {summary}
                            </ReactMarkdown>
                        </div>
                        <p className="text-[10px] text-rose-900/40 text-center uppercase tracking-wider font-semibold">
                            Generated by AI
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
