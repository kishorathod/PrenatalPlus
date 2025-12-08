import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getPatientDetails, getPatientVitalsHistory } from "@/server/actions/doctor"
import { getDoctorUpcomingAppointments } from "@/server/actions/doctor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GenerateReportClient } from "@/components/reports/GenerateReportClient"

interface Props {
    params: { patientId: string }
}

export default async function GenerateReportPage({ params }: Props) {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        redirect("/login?role=doctor")
    }

    const [patientResult, vitalsResult, appointmentsResult] = await Promise.all([
        getPatientDetails(params.patientId),
        getPatientVitalsHistory(params.patientId),
        getDoctorUpcomingAppointments()
    ])

    if (patientResult.error || !patientResult.patient) {
        return (
            <div className="container mx-auto px-6 py-8">
                <p className="text-red-500">Failed to load patient data</p>
            </div>
        )
    }

    const patient = patientResult.patient
    const vitals = vitalsResult.vitals || []
    const patientAppointments = appointmentsResult.appointments?.filter(
        apt => apt.patient.id === params.patientId
    ) || []

    const activePregnancy = patient.pregnancies?.[0]

    return (
        <div className="container mx-auto px-6 py-8 space-y-6">
            {/* Header */}
            <div>
                <Link href="/doctor/patients">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Patients
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FileText className="h-8 w-8 text-pink-500" />
                    Generate Report for {patient.name}
                </h1>
                <p className="text-gray-600 mt-1">
                    Create PDF reports for patient records
                </p>
            </div>

            {/* Patient Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Name</p>
                            <p className="font-medium">{patient.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Current Week</p>
                            <p className="font-medium">Week {activePregnancy?.currentWeek || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Due Date</p>
                            <p className="font-medium">
                                {activePregnancy?.dueDate
                                    ? new Date(activePregnancy.dueDate).toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Report Options */}
            {activePregnancy ? (
                <GenerateReportClient
                    patientData={{
                        name: patient.name || "Patient",
                        currentWeek: activePregnancy.currentWeek,
                        dueDate: activePregnancy.dueDate,
                        riskLevel: activePregnancy.riskLevel ?? undefined
                    }}
                    vitals={vitals}
                    appointments={patientAppointments}
                />
            ) : (
                <Card>
                    <CardContent className="py-8 text-center text-gray-500">
                        No active pregnancy found for this patient
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
