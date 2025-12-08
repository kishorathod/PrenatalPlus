"use client"

import { motion, Variants } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Activity, ClipboardList, Clock, ArrowRight, ChevronRight, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CountUp from "react-countup"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
}

interface DashboardViewProps {
    stats: any
    appointments: any[]
    highRiskPatients: any[]
}

export function DashboardView({ stats, appointments, highRiskPatients }: DashboardViewProps) {
    const todayAppointments = appointments?.filter(apt => {
        const aptDate = new Date(apt.appointmentDate)
        const today = new Date()
        return aptDate.toDateString() === today.toDateString()
    }) || []

    const getTimeGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 18) return "Good afternoon"
        return "Good evening"
    }

    // Mock data for the chart - in a real app this would come from the backend
    const chartData = [
        { name: 'Mon', visits: 4 },
        { name: 'Tue', visits: 3 },
        { name: 'Wed', visits: 7 },
        { name: 'Thu', visits: 5 },
        { name: 'Fri', visits: 8 },
        { name: 'Sat', visits: 2 },
        { name: 'Sun', visits: 1 },
    ]

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-8 space-y-8 max-w-7xl mx-auto"
        >
            <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                        {getTimeGreeting()}, Doctor
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg dark:text-gray-400">
                        Here's what's happening in your clinic today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button className="rounded-full shadow-lg shadow-pink-200 hover:shadow-pink-300 dark:shadow-pink-900/20 transition-all bg-gradient-to-r from-pink-500 to-purple-500 border-0">
                        <Calendar className="mr-2 h-4 w-4" />
                        View Schedule
                    </Button>
                </div>
            </motion.div>

            <motion.div variants={item} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Patients"
                    value={stats?.totalPatients || 0}
                    label="Active patients"
                    icon={Users}
                    color="text-blue-500 dark:text-blue-400"
                    bg="bg-blue-50 dark:bg-blue-500/10"
                    gradient="from-blue-50 to-white dark:from-gray-900 dark:to-gray-800"
                />
                <StatsCard
                    title="Appointments Today"
                    value={stats?.todayAppointments || 0}
                    label={`${todayAppointments.length} upcoming`}
                    icon={Calendar}
                    color="text-purple-500 dark:text-purple-400"
                    bg="bg-purple-50 dark:bg-purple-500/10"
                    gradient="from-purple-50 to-white dark:from-gray-900 dark:to-gray-800"
                />
                <StatsCard
                    title="High Risk Alerts"
                    value={stats?.highRiskCount || 0}
                    label="Requires attention"
                    icon={Activity}
                    color="text-red-500 dark:text-red-400"
                    bg="bg-red-50 dark:bg-red-500/10"
                    gradient="from-red-50 to-white dark:from-gray-900 dark:to-gray-800"
                />
                <StatsCard
                    title="Upcoming (7 days)"
                    value={appointments?.length || 0}
                    label="Scheduled"
                    icon={ClipboardList}
                    color="text-emerald-500 dark:text-emerald-400"
                    bg="bg-emerald-50 dark:bg-emerald-500/10"
                    gradient="from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800"
                />
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <motion.div variants={item} className="col-span-4 space-y-8">
                    {/* Chart Section */}
                    <Card className="border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)] backdrop-blur-md bg-white/70 dark:bg-gray-900/50 border-white/20 dark:border-white/10 overflow-hidden transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="font-heading text-lg flex items-center gap-2 dark:text-gray-200">
                                <TrendingUp className="h-5 w-5 text-pink-500" />
                                Weekly Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:stroke-gray-800" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                                        itemStyle={{ color: '#111827' }}
                                    />
                                    <Area type="monotone" dataKey="visits" stroke="#EC4899" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)] backdrop-blur-md bg-white/70 dark:bg-gray-900/50 border-white/20 dark:border-white/10 overflow-hidden transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                            <CardTitle className="font-heading text-xl dark:text-gray-200">Today's Schedule</CardTitle>
                            <Link href="/doctor/appointments">
                                <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-full px-4">
                                    View All <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            {todayAppointments.length > 0 ? (
                                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {todayAppointments.slice(0, 5).map((appointment, i) => (
                                        <motion.div
                                            key={appointment.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center justify-between p-5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-700 shadow-sm ring-2 ring-gray-50 dark:ring-gray-800 group-hover:ring-pink-100 dark:group-hover:ring-pink-900/30 transition-all">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.patient.email}`} />
                                                        <AvatarFallback>{appointment.patient.name?.[0] || "P"}</AvatarFallback>
                                                    </Avatar>
                                                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${appointment.status === "CONFIRMED" ? "bg-emerald-500" : "bg-gray-300"
                                                        }`} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-gray-200 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                                                        {appointment.patient.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground dark:text-gray-400">{appointment.purpose || "General Checkup"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {new Date(appointment.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 text-gray-400 hover:text-pink-600 dark:hover:text-pink-400">
                                                    <ChevronRight className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-16 w-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4">
                                        <Calendar className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <p className="text-muted-foreground font-medium">No appointments today</p>
                                    <Button variant="link" className="mt-2 text-pink-600 dark:text-pink-400">Check calendar</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item} className="col-span-3">
                    <Card className="h-full border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)] backdrop-blur-md bg-white/70 dark:bg-gray-900/50 border-white/20 dark:border-white/10 overflow-hidden flex flex-col transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 bg-gradient-to-r from-red-50/30 to-transparent dark:from-red-900/10">
                            <CardTitle className="font-heading text-xl flex items-center gap-2 dark:text-gray-200">
                                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                    <Activity className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                                High-Risk Patients
                            </CardTitle>
                            <Link href="/doctor/patients">
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
                                    View All
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            {highRiskPatients && highRiskPatients.length > 0 ? (
                                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {highRiskPatients.slice(0, 5).map((patient, i) => (
                                        <motion.div
                                            key={patient.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-5 hover:bg-red-50/20 dark:hover:bg-red-900/10 transition-all duration-300 group"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border border-red-100 dark:border-red-900/30 ring-2 ring-white dark:ring-gray-800">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.email}`} />
                                                        <AvatarFallback>{patient.name?.[0] || "P"}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-200">{patient.name}</p>
                                                        <p className="text-xs text-muted-foreground dark:text-gray-400">Week {patient.pregnancies[0]?.currentWeek}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="destructive" className="shadow-sm bg-red-500 hover:bg-red-600 border-0">HIGH RISK</Badge>
                                            </div>

                                            {/* Vital Preview */}
                                            {patient.vitalReadings?.[0] && (
                                                <div className="grid grid-cols-2 gap-2 mb-3">
                                                    <div className="bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700 text-xs">
                                                        <span className="text-muted-foreground dark:text-gray-400 block">BP</span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-200">
                                                            {patient.vitalReadings[0].bloodPressureSystolic}/{patient.vitalReadings[0].bloodPressureDiastolic}
                                                        </span>
                                                    </div>
                                                    <div className="bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700 text-xs">
                                                        <span className="text-muted-foreground dark:text-gray-400 block">Heart Rate</span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-200">
                                                            {patient.vitalReadings[0].heartRate} bpm
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <Link href={`/doctor/patients/${patient.id}`} className="block">
                                                <Button size="sm" variant="outline" className="w-full text-xs h-9 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 hover:border-red-200 transition-all">
                                                    View Patient Details
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                                    <div className="h-16 w-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-4">
                                        <Activity className="h-8 w-8 text-green-500 dark:text-green-400" />
                                    </div>
                                    <p className="text-muted-foreground font-medium">No high-risk patients</p>
                                    <p className="text-xs text-muted-foreground mt-1">Great job keeping everyone healthy!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    )
}

function StatsCard({ title, value, label, icon: Icon, color, bg, gradient }: any) {
    return (
        <Card className={`border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)] backdrop-blur-md bg-white/70 dark:bg-gray-900/50 border-white/20 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative bg-gradient-to-br ${gradient}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
                <Icon className="h-32 w-32 -mr-10 -mt-10 transform rotate-12" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">{title}</CardTitle>
                <div className={`p-2.5 rounded-xl ${bg} ${color} shadow-sm dark:shadow-none`}>
                    <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-3xl font-bold font-heading text-gray-900 dark:text-gray-100">
                    <CountUp end={value} duration={2} />
                </div>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1 font-medium">{label}</p>
            </CardContent>
        </Card>
    )
}
