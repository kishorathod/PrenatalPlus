import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { KickCounterClient } from "@/components/kick-counter/KickCounterClient"
import { getKickHistory, getKickTrends } from "@/server/actions/kick-counter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { TrendingUp, Calendar } from "lucide-react"

export default async function KickCounterPage() {
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

    const [{ kickCounts }, { trends, averageKicks, isDecreasing }] = await Promise.all([
        getKickHistory(pregnancy.id, 10),
        getKickTrends(pregnancy.id)
    ])

    return (
        <div className="container mx-auto px-6 py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Kick Counter</h1>
                <p className="text-gray-600 mt-1">Track your baby's movements</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Counter Interface */}
                <div>
                    <KickCounterClient pregnancyId={pregnancy.id} currentWeek={pregnancy.currentWeek} />
                </div>

                {/* Trends and History */}
                <div className="space-y-6">
                    {/* Weekly Trend */}
                    {trends && trends.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-500" />
                                    Weekly Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {trends.map((trend, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <span className="text-sm text-gray-600">
                                                {format(new Date(trend.date), "MMM dd")}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-pink-500 h-2 rounded-full"
                                                        style={{ width: `${Math.min((trend.count / 15) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-semibold w-8">{trend.count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        Average kicks per session: <span className="font-semibold">{averageKicks.toFixed(1)}</span>
                                    </p>
                                    {isDecreasing && (
                                        <p className="text-sm text-red-600 mt-1">
                                            ⚠️ Movement has decreased. Contact your doctor if concerned.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-purple-500" />
                                Recent Sessions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {kickCounts && kickCounts.length > 0 ? (
                                <div className="space-y-3">
                                    {kickCounts.map((kc) => (
                                        <div key={kc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-semibold">{kc.count} kicks</p>
                                                <p className="text-xs text-gray-500">
                                                    {format(new Date(kc.createdAt), "PPp")}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">{kc.duration} min</p>
                                                {kc.notes && (
                                                    <p className="text-xs text-gray-500 mt-1">{kc.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-4">No sessions yet</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
