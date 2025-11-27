import { getAnalyticsData } from "@/server/actions/admin"
import { AnalyticsCharts } from "@/components/features/admin/AnalyticsCharts"

export default async function AdminAnalyticsPage() {
    const { growthData, appointmentData } = await getAnalyticsData()

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Analytics</h1>
            <AnalyticsCharts growthData={growthData} appointmentData={appointmentData} />
        </div>
    )
}
