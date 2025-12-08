import { getDoctorStats, getDoctorUpcomingAppointments, getHighRiskPatients } from "@/server/actions/doctor"
import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { DashboardView } from "@/components/doctor/DashboardView"

export default async function DoctorDashboard() {
    // Server-side authorization check
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        redirect("/login?role=doctor")
    }

    const { stats } = await getDoctorStats()
    const { appointments } = await getDoctorUpcomingAppointments()
    const { patients: highRiskPatients } = await getHighRiskPatients()

    return (
        <DashboardView
            stats={stats}
            appointments={appointments}
            highRiskPatients={highRiskPatients}
        />
    )
}
