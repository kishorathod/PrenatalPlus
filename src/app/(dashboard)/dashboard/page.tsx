"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Calendar, Heart, FileText, Baby, RefreshCw, Sparkles } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useDashboard } from "@/hooks/useDashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loading } from "@/components/ui/loading"

export default function DashboardPage() {
  const { user } = useAuth()
  const { stats, isLoading, error, refresh } = useDashboard()

  const statCards = [
    {
      title: "Appointments",
      value: stats?.stats.upcomingAppointments ?? 0,
      subtitle: stats?.stats.upcomingAppointments === 1 ? "upcoming" : "upcoming",
      icon: Calendar,
      bgColor: "bg-gradient-to-br from-secondary/40 to-secondary/20",
      iconColor: "text-blue-600",
      ringColor: "ring-blue-100",
    },
    {
      title: "Vitals",
      value: stats?.stats.totalVitals ?? 0,
      subtitle: stats?.stats.totalVitals === 1 ? "record" : "records",
      icon: Heart,
      bgColor: "bg-gradient-to-br from-pink-100 to-pink-50",
      iconColor: "text-pink-600",
      ringColor: "ring-pink-100",
    },
    {
      title: "Reports",
      value: stats?.stats.totalReports ?? 0,
      subtitle: stats?.stats.totalReports === 1 ? "report" : "reports",
      icon: FileText,
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-50",
      iconColor: "text-purple-600",
      ringColor: "ring-purple-100",
    },
    {
      title: "Pregnancies",
      value: stats?.stats.activePregnancies ?? 0,
      subtitle: stats?.stats.activePregnancies === 0 ? "none active" : stats?.stats.activePregnancies === 1 ? "active" : "active",
      icon: Baby,
      bgColor: "bg-gradient-to-br from-accent/40 to-accent/20",
      iconColor: "text-purple-600",
      ringColor: "ring-purple-100",
    },
  ]

  const recentAppointments = stats?.recent.appointments ?? []
  const recentVitals = stats?.recent.vitals ?? []

  const recentActivity = [
    ...recentAppointments.map((appointment) => ({
      id: `appt-${appointment.id}`,
      label: appointment.title,
      date: appointment.date,
      detail: appointment.status,
      icon: Calendar,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    })),
    ...recentVitals.map((vital) => ({
      id: `vital-${vital.id}`,
      label: vital.type,
      date: vital.recordedAt,
      detail: `${vital.value} ${vital.unit}`,
      icon: Heart,
      iconColor: "text-pink-600",
      bgColor: "bg-pink-50",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (isLoading && !stats) {
    return <Loading size="lg" text="Loading dashboard..." />
  }

  return (
    <div className="container mx-auto px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-800">
            Welcome back, {user?.name || "User"}! 🌸
          </h1>
          <p className="text-gray-500 mt-2 text-base">
            Here's your care overview for this week
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={isLoading} className="shadow-sm rounded-xl">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin-slow' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="shadow-sm rounded-lg">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Wellness Message */}
      {!error && stats && (
        <div className="relative bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 shadow-[0_4px_14px_rgba(0,0,0,0.05)] border-t-2 border-pink-200 overflow-hidden">
          {/* Subtle decorative element */}
          <div className="absolute top-2 right-4 opacity-20">
            <Sparkles className="h-8 w-8 text-pink-400" />
          </div>
          <div className="relative flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <Heart className="h-5 w-5 text-pink-500 fill-pink-200" />
              </div>
            </div>
            <p className="text-gray-700 text-sm font-medium">
              Everything looks good today. Keep up the great care!
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="shadow-[0_4px_14px_rgba(0,0,0,0.05)] border-0 bg-white/80 backdrop-blur-sm hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-shadow rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-3">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-semibold text-gray-800">{stat.value}</p>
                      <p className="text-sm text-gray-500">
                        {stat.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    {/* Gradient circle background */}
                    <div className={`absolute inset-0 ${stat.bgColor} rounded-2xl blur-sm opacity-60`}></div>
                    <div className={`relative p-4 rounded-2xl ${stat.bgColor} ring-2 ${stat.ringColor}`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="shadow-[0_4px_14px_rgba(0,0,0,0.05)] border-0 border-t-2 border-pink-100 bg-white/70 backdrop-blur-sm rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild variant="secondary" className="justify-start h-auto py-4 px-5 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <Link href="/appointments" className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-blue-50 ring-1 ring-blue-100">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">Schedule appointment</span>
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start h-auto py-4 px-5 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <Link href="/vitals" className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-pink-50 ring-1 ring-pink-100">
                  <Heart className="h-5 w-5 text-pink-600" />
                </div>
                <span className="text-gray-700 font-medium">Record vitals</span>
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start h-auto py-4 px-5 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <Link href="/reports" className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-purple-50 ring-1 ring-purple-100">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-gray-700 font-medium">Upload report</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-[0_4px_14px_rgba(0,0,0,0.05)] border-0 border-t-2 border-purple-100 bg-white/70 backdrop-blur-sm rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center leading-relaxed">
                No recent activity
              </p>
            ) : (
              recentActivity.slice(0, 5).map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className={`p-2.5 rounded-xl ${item.bgColor} ring-1 ring-white/50`}>
                      <Icon className={`h-4 w-4 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate leading-relaxed">{item.label}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                        {format(new Date(item.date), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
