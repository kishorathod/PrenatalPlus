import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getHealthSummary, getVitalsTrends } from "@/server/actions/health-analytics"
import { HealthSummaryCard } from "@/components/health/HealthSummaryCard"
import { VitalsTrendChart } from "@/components/health/VitalsTrendChart"
import { HealthAlertsPanel } from "@/components/health/HealthAlertsPanel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Plus, Heart } from "lucide-react"
import Link from "next/link"

export default async function HealthPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    const [summaryResult, trendsResult] = await Promise.all([
        getHealthSummary(),
        getVitalsTrends(30)
    ])

    const summary = summaryResult.summary
    const trends = trendsResult.trends || []

    return (
        <div className="container mx-auto px-6 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Activity className="h-8 w-8 text-pink-500" />
                        Health Analytics
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Track your vitals and monitor your health trends
                    </p>
                </div>
                <Link href="/vitals">
                    <Button className="bg-pink-500 hover:bg-pink-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Record Vitals
                    </Button>
                </Link>
            </div>

            {/* Health Alerts */}
            {summary?.alerts && summary.alerts.length > 0 && (
                <HealthAlertsPanel alerts={summary.alerts} />
            )}

            {/* Health Summary Card */}
            {summary && (
                <HealthSummaryCard
                    healthScore={summary.healthScore}
                    latestVitals={summary.latestVitals}
                    trends={summary.trends}
                />
            )}

            {/* Vitals Trend Chart */}
            <VitalsTrendChart data={trends} />

            {/* Quick Tips */}
            <Card className="border-gray-100 bg-gradient-to-r from-pink-50 to-purple-50">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="h-5 w-5 text-pink-500" />
                        Health Tips
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/60 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-1">Record Regularly</h4>
                            <p className="text-sm text-gray-600">
                                Track your vitals daily for accurate trend analysis
                            </p>
                        </div>
                        <div className="p-4 bg-white/60 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-1">Stay Hydrated</h4>
                            <p className="text-sm text-gray-600">
                                Drink 8-10 glasses of water daily during pregnancy
                            </p>
                        </div>
                        <div className="p-4 bg-white/60 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-1">Monitor Changes</h4>
                            <p className="text-sm text-gray-600">
                                Report any sudden changes to your doctor immediately
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
