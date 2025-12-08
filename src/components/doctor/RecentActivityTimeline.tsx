"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, Calendar, MessageSquare, Heart } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
    id: string
    type: "VITALS" | "APPOINTMENT" | "MESSAGE"
    user: {
        id: string
        name: string | null
        avatar: string | null
    }
    date: Date | string
    data: any
}

interface RecentActivityTimelineProps {
    activities: ActivityItem[]
}

function getActivityIcon(type: string) {
    switch (type) {
        case "VITALS":
            return <Heart className="h-4 w-4 text-pink-500" />
        case "APPOINTMENT":
            return <Calendar className="h-4 w-4 text-blue-500" />
        case "MESSAGE":
            return <MessageSquare className="h-4 w-4 text-green-500" />
        default:
            return <Activity className="h-4 w-4 text-gray-500" />
    }
}

function getActivityText(activity: ActivityItem) {
    switch (activity.type) {
        case "VITALS":
            return `recorded vitals: BP ${activity.data.systolic}/${activity.data.diastolic}`
        case "APPOINTMENT":
            return `booked appointment: ${activity.data.title}`
        case "MESSAGE":
            return `sent a message`
        default:
            return "performed an action"
    }
}

export function RecentActivityTimeline({ activities }: RecentActivityTimelineProps) {
    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent activity</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <div key={activity.id} className="flex gap-3">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                        <div className="p-2 bg-gray-100 rounded-full">
                            {getActivityIcon(activity.type)}
                        </div>
                        {index < activities.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 mt-2" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={activity.user.avatar || ""} />
                                    <AvatarFallback className="text-xs">
                                        {activity.user.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                    <span className="font-medium">{activity.user.name}</span>
                                    {" "}
                                    <span className="text-gray-600">{getActivityText(activity)}</span>
                                </p>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
