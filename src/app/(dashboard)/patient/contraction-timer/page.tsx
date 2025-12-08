import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ContractionTimerClient } from "@/components/contraction-timer/ContractionTimerClient"
import { getContractionHistory } from "@/server/actions/contraction-timer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { History, TrendingUp } from "lucide-react"

export default async function ContractionTimerPage() {
    const session = await auth()
    if (!session?.user || session.user.role !== "PATIENT") {
        redirect("/login")
    }

    // Get active pregnancy
    const pregnancy = await prisma.pregnancy.findFirst({
        where: {
            userId: session.user.id!,
            status: "ACTIVE"
        }
    })

    if (!pregnancy) {
        return (
            <div className="container mx-auto px-6 py-8">
                <p className="text-center text-gray-500">No active pregnancy found.</p>
            </div>
        )
    }

    const { sessions } = await getContractionHistory(pregnancy.id, 5)

    return (
        <div className="container mx-auto px-6 py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Contraction Timer</h1>
                <p className="text-gray-600 mt-1">Track labor contractions and patterns</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Timer Interface */}
                <div>
                    <ContractionTimerClient pregnancyId={pregnancy.id} />
                </div>

                {/* History */}
                <div className="space-y-6">
                    {/* Session History */}
                    {sessions && sessions.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5 text-purple-500" />
                                    Previous Sessions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {sessions.map((sess) => {
                                        const duration = sess.endedAt
                                            ? Math.floor((new Date(sess.endedAt).getTime() - new Date(sess.startedAt).getTime()) / 60000)
                                            : 0

                                        return (
                                            <div key={sess.id} className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold">
                                                            {sess.contractions.length} contractions
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {format(new Date(sess.startedAt), "PPp")}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">{duration} min</p>
                                                    </div>
                                                </div>
                                                {sess.contractions.length > 0 && (
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        Avg duration: {Math.round(sess.contractions.reduce((sum: number, c: any) => sum + c.duration, 0) / sess.contractions.length)}s
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                                Labor Stages
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="font-semibold text-blue-900">Early Labor</p>
                                    <p className="text-blue-700 text-xs mt-1">
                                        Contractions 5-20 min apart, 30-45s duration
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <p className="font-semibold text-purple-900">Active Labor</p>
                                    <p className="text-purple-700 text-xs mt-1">
                                        Contractions 3-5 min apart, 45-60s duration
                                    </p>
                                </div>
                                <div className="p-3 bg-pink-50 rounded-lg">
                                    <p className="font-semibold text-pink-900">Transition</p>
                                    <p className="text-pink-700 text-xs mt-1">
                                        Contractions 2-3 min apart, 60-90s duration
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
