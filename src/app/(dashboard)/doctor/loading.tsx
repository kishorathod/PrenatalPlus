import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardLoading() {
    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64 bg-gray-200/50 dark:bg-gray-800/50" />
                    <Skeleton className="h-6 w-96 bg-gray-200/50 dark:bg-gray-800/50" />
                </div>
                <Skeleton className="h-10 w-40 rounded-full bg-gray-200/50 dark:bg-gray-800/50" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border-none shadow-sm bg-white/50 dark:bg-gray-900/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24 bg-gray-200/50 dark:bg-gray-800/50" />
                            <Skeleton className="h-8 w-8 rounded-full bg-gray-200/50 dark:bg-gray-800/50" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2 bg-gray-200/50 dark:bg-gray-800/50" />
                            <Skeleton className="h-3 w-32 bg-gray-200/50 dark:bg-gray-800/50" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 space-y-8">
                    {/* Chart Skeleton */}
                    <Card className="border-none shadow-sm bg-white/50 dark:bg-gray-900/50 h-[300px]">
                        <CardHeader>
                            <Skeleton className="h-6 w-48 bg-gray-200/50 dark:bg-gray-800/50" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[200px] w-full bg-gray-200/50 dark:bg-gray-800/50 rounded-xl" />
                        </CardContent>
                    </Card>

                    {/* Appointments Skeleton */}
                    <Card className="border-none shadow-sm bg-white/50 dark:bg-gray-900/50">
                        <CardHeader className="flex justify-between items-center">
                            <Skeleton className="h-6 w-48 bg-gray-200/50 dark:bg-gray-800/50" />
                            <Skeleton className="h-8 w-24 rounded-full bg-gray-200/50 dark:bg-gray-800/50" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-12 w-12 rounded-full bg-gray-200/50 dark:bg-gray-800/50" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32 bg-gray-200/50 dark:bg-gray-800/50" />
                                            <Skeleton className="h-3 w-24 bg-gray-200/50 dark:bg-gray-800/50" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-8 w-24 rounded-full bg-gray-200/50 dark:bg-gray-800/50" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-3">
                    {/* High Risk Skeleton */}
                    <Card className="border-none shadow-sm bg-white/50 dark:bg-gray-900/50 h-full">
                        <CardHeader className="flex justify-between items-center">
                            <Skeleton className="h-6 w-48 bg-gray-200/50 dark:bg-gray-800/50" />
                            <Skeleton className="h-8 w-24 rounded-full bg-gray-200/50 dark:bg-gray-800/50" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <div className="flex gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full bg-gray-200/50 dark:bg-gray-800/50" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32 bg-gray-200/50 dark:bg-gray-800/50" />
                                                <Skeleton className="h-3 w-20 bg-gray-200/50 dark:bg-gray-800/50" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-6 w-20 rounded-full bg-gray-200/50 dark:bg-gray-800/50" />
                                    </div>
                                    <Skeleton className="h-8 w-full rounded-md bg-gray-200/50 dark:bg-gray-800/50" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
