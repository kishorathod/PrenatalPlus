import Link from "next/link"
import { format } from "date-fns"
import { Calendar, Heart, FileText, Baby, Sparkles, Plus, Clock, Lightbulb, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getPatientDashboardStats } from "@/server/actions/dashboard"
import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { RefreshButton } from "@/components/dashboard/RefreshButton"
import { WeeklySummaryCard } from "@/components/features/ai-summary/WeeklySummaryCard"
import { BabyProgressCard } from "@/components/dashboard/BabyProgressCard"
import { getBabySizeText, getTrimester, getDailyTip } from "@/lib/pregnancy-helpers"
import { DailyChecklist } from "@/components/dashboard/DailyChecklist"

export const revalidate = 0

export default async function PatientDashboard() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    const { stats, recentActivity, pregnancy } = await getPatientDashboardStats()
    const pregnancyWeek = pregnancy?.currentWeek || 0

    return (
        <div className="container mx-auto px-4 py-6 space-y-6 min-h-screen bg-slate-50/50 relative overflow-hidden">

            {/* Ambient Background Animation (Aurora) */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-r from-pink-100/40 via-purple-100/40 to-blue-100/40 blur-3xl -z-10 animate-aurora bg-[length:200%_200%] pointer-events-none"></div>

            {/* Top Heading & Baby Progress */}
            <div className="grid gap-6 md:grid-cols-12 items-start relative z-10">
                <div className="md:col-span-8 space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">{session.user.name?.split(' ')[0] || 'Mom'}</span>
                    </h1>

                    {pregnancy ? (
                        <>
                            <p className="text-slate-500 text-lg">
                                Week {pregnancyWeek} · {getTrimester(pregnancyWeek)} · Baby is the size of a <span className="font-semibold text-rose-500">{getBabySizeText(pregnancyWeek)}</span>
                            </p>

                            <div className="flex flex-wrap gap-4 mt-4">
                                {/* Status Alert */}
                                <Alert className="bg-pink-50/50 border-pink-100 text-pink-800 rounded-2xl w-auto inline-flex items-center shadow-sm">
                                    <CheckCircle2 className="h-4 w-4 text-pink-600 mr-2" />
                                    <AlertDescription className="font-medium text-pink-700">
                                        Everything looks good today.
                                    </AlertDescription>
                                </Alert>

                                {/* Daily Tip (Fills empty space) */}
                                <div className="inline-flex items-center gap-2 px-4 py-3 bg-yellow-50/80 border border-yellow-100 rounded-2xl text-yellow-800 text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-700 shadow-sm">
                                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                                    <span>Tip: {getDailyTip()}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="mt-4 p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-white shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-800 mb-2">Start Your Pregnancy Journey</h2>
                            <p className="text-slate-600 mb-4">Track your pregnancy week by week, monitor vitals, and get personalized insights.</p>
                            <Button asChild className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 border-none shadow-md shadow-pink-200">
                                <Link href="/pregnancy">
                                    <Plus className="mr-2 h-4 w-4" /> Start New Pregnancy
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {pregnancy && (
                    <div className="md:col-span-4">
                        <BabyProgressCard week={pregnancyWeek || 1} />
                    </div>
                )}
            </div>

            <div className="grid gap-8 lg:grid-cols-12 relative z-10">

                {/* Main Content Column (Left) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* AI Weekly Summary */}
                    {pregnancy && <WeeklySummaryCard />}

                    {/* Stats Grid */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ActivityIcon color="text-blue-500" /> Your Health Overview
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                icon={Calendar}
                                label="Appointments"
                                value={stats?.upcomingAppointments || 0}
                                subtext="upcoming"
                                color="bg-blue-50 text-blue-600"
                            />
                            <StatCard
                                icon={Heart}
                                label="Vitals"
                                value={stats?.totalVitals || 0}
                                subtext="records"
                                color="bg-pink-50 text-pink-600"
                            />
                            <StatCard
                                icon={FileText}
                                label="Reports"
                                value={stats?.totalReports || 0}
                                subtext="files"
                                color="bg-purple-50 text-purple-600"
                            />
                            <StatCard
                                icon={Baby}
                                label="Pregnancy"
                                value={stats?.activePregnancies ? "Active" : "-"}
                                subtext="Week 12"
                                color="bg-green-50 text-green-600"
                            />
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
                            <Button variant="ghost" size="sm" className="text-slate-400 font-normal">View All</Button>
                        </div>
                        <div className="space-y-4">
                            {recentActivity && recentActivity.length > 0 ? (
                                recentActivity.map((activity: any, index: number) => (
                                    <div key={index} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                        <div className={`p-3 rounded-xl ${activity.type === 'APPOINTMENT' ? 'bg-blue-50 text-blue-600' :
                                            activity.type === 'VITALS' ? 'bg-pink-50 text-pink-600' :
                                                'bg-purple-50 text-purple-600'
                                            }`}>
                                            {activity.type === 'APPOINTMENT' && <Calendar className="h-5 w-5" />}
                                            {activity.type === 'VITALS' && <Heart className="h-5 w-5" />}
                                            {activity.type === 'REPORT' && <FileText className="h-5 w-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-700 group-hover:text-slate-900">
                                                {activity.type === 'APPOINTMENT' && (activity.data.title || "Appointment")}
                                                {activity.type === 'VITALS' && "Vitals Recorded"}
                                                {activity.type === 'REPORT' && "Report Uploaded"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {format(new Date(activity.date), "MMM dd, yyyy")}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-slate-600">
                                                {format(new Date(activity.date), "h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-slate-400 py-8">No recent activity</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Sidebar Column (Right) */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Daily Checklist */}
                    {pregnancy && <DailyChecklist />}

                    {/* Quick Actions (Sticky on Mobile, Sidebar on Desktop) */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 lg:static lg:bg-transparent lg:border-none lg:p-0 lg:z-auto transition-all duration-300">
                        <h2 className="hidden lg:block text-lg font-bold text-slate-800 mb-4 px-1">Quick Actions</h2>
                        <div className="flex gap-3 overflow-x-auto lg:overflow-visible lg:flex-col pb-1 lg:pb-0 no-scrollbar">
                            {/* Softer colors as requested */}
                            <QuickActionButton
                                href="/appointments"
                                icon={Calendar}
                                label="Schedule"
                                fullLabel="Schedule Appointment"
                                color="bg-blue-400 hover:bg-blue-500"
                                shadow="shadow-blue-200/50"
                            />
                            <QuickActionButton
                                href="/vitals"
                                icon={Heart}
                                label="Record"
                                fullLabel="Record Vitals"
                                color="bg-pink-400 hover:bg-pink-500"
                                shadow="shadow-pink-200/50"
                            />
                            <QuickActionButton
                                href="/reports"
                                icon={FileText}
                                label="Upload"
                                fullLabel="Upload Report"
                                color="bg-purple-400 hover:bg-purple-500"
                                shadow="shadow-purple-200/50"
                            />
                        </div>
                    </div>

                    {/* Spacer for mobile to prevent content being hidden behind sticky bar */}
                    <div className="h-24 lg:hidden"></div>



                </div>
            </div>
        </div>
    )
}

// Sub-components for cleaner code
function StatCard({ icon: Icon, label, value, subtext, color }: any) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden group">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500">{label}</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2 tracking-tight group-hover:scale-105 transition-transform origin-left">{value}</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">{subtext}</p>
                    </div>
                    <div className={`p-3 rounded-2xl ${color} bg-opacity-20`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function QuickActionButton({ href, icon: Icon, label, fullLabel, color, shadow }: any) {
    return (
        <Button asChild className={`flex-1 min-w-[120px] lg:w-full h-12 lg:h-14 rounded-2xl lg:justify-start px-4 text-sm lg:text-base font-semibold shadow-sm lg:shadow-lg ${shadow} ${color} border-none transition-all hover:scale-[1.02] active:scale-95`}>
            <Link href={href} className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3">
                <div className="bg-white/20 p-1 lg:p-1.5 rounded-lg">
                    <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
                <span className="lg:hidden">{label}</span>
                <span className="hidden lg:inline">{fullLabel || label}</span>
            </Link>
        </Button>
    )
}

function ActivityIcon({ color }: { color: string }) {
    return (
        <svg
            className={`h-5 w-5 ${color}`}
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
