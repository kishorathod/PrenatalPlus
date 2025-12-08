"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Heart, FileText, Clock } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface ActivityFeedProps {
    activities: any[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
    if (!activities || activities.length === 0) {
        return (
            <Card className="border-none shadow-sm h-full dark:bg-gray-900/50 dark:border-white/10">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <Clock className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-muted-foreground text-sm">No recent activity</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-none shadow-sm h-full dark:bg-gray-900/50 dark:border-white/10">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {activities.map((activity, index) => (
                        <div key={index} className="p-4 flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className={`
                                flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center
                                ${activity.type === 'APPOINTMENT' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : ''}
                                ${activity.type === 'VITALS' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400' : ''}
                                ${activity.type === 'REPORT' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : ''}
                            `}>
                                {activity.type === 'APPOINTMENT' && <Calendar className="h-5 w-5" />}
                                {activity.type === 'VITALS' && <Heart className="h-5 w-5" />}
                                {activity.type === 'REPORT' && <FileText className="h-5 w-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {activity.type === 'APPOINTMENT' && (activity.data.title || "Appointment")}
                                        {activity.type === 'VITALS' && "Vitals Recorded"}
                                        {activity.type === 'REPORT' && "Report Uploaded"}
                                    </p>
                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                        {format(new Date(activity.date), "MMM dd")}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {activity.type === 'APPOINTMENT' && `With ${activity.data.doctor?.name || "Doctor"}`}
                                    {activity.type === 'VITALS' && `${activity.data.bloodPressureSystolic}/${activity.data.bloodPressureDiastolic} mmHg • ${activity.data.heartRate} bpm`}
                                    {activity.type === 'REPORT' && "Lab results available"}
                                </p>
                                {activity.type === 'APPOINTMENT' && (
                                    <Badge variant="outline" className={`mt-2 text-[10px] px-2 py-0 h-5 ${activity.data.status === 'CONFIRMED' ? 'border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400' : 'border-gray-200 text-gray-600'
                                        }`}>
                                        {activity.data.status}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
