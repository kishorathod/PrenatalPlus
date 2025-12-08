import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPatientDetails, getPatientVitalsHistory, getDoctorNotes } from "@/server/actions/doctor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Activity, FileText, ArrowLeft, Plus, Stethoscope, Pill, FlaskConical } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/server/auth"
import { MedicalNoteForm } from "@/components/doctor/MedicalNoteForm"
import { RiskLevelBadge } from "@/components/doctor/RiskLevelBadge"
import { PatientVitalsChart } from "@/components/doctor/PatientVitalsChart"
import { PatientAlertList } from "@/components/doctor/PatientAlertList"
import { PrescriptionForm } from "@/components/doctor/PrescriptionForm"
import { LabTestRequestForm } from "@/components/doctor/LabTestRequestForm"
import { format } from "date-fns"

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
    // Server-side authorization check
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        redirect("/login?role=doctor")
    }

    const [{ patient }, { vitals }, { notes }] = await Promise.all([
        getPatientDetails(params.id),
        getPatientVitalsHistory(params.id),
        getDoctorNotes(params.id),
    ])

    if (!patient) {
        notFound()
    }

    const activePregnancy = patient.pregnancies[0]
    const vitalsWithAlerts = vitals?.filter((v: any) => v.alerts && v.alerts.length > 0) || []

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/doctor/patients">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.email}`} />
                            <AvatarFallback>{patient.name?.[0] || "P"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold">{patient.name}</h1>
                            <p className="text-muted-foreground">{patient.email}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <MedicalNoteForm patientId={patient.id} patientName={patient.name || "Patient"} />
                    <PrescriptionForm
                        patientId={patient.id}
                        pregnancyId={activePregnancy?.id}
                        patientName={patient.name || "Patient"}
                    />
                    <LabTestRequestForm
                        patientId={patient.id}
                        pregnancyId={activePregnancy?.id}
                        patientName={patient.name || "Patient"}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pregnancy Status</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {activePregnancy ? (
                            <>
                                <div className="text-2xl font-bold">Week {activePregnancy.currentWeek}</div>
                                <p className="text-xs text-muted-foreground">
                                    Due: {new Date(activePregnancy.dueDate).toLocaleDateString()}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">No active pregnancy</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {activePregnancy?.riskLevel ? (
                            <RiskLevelBadge
                                pregnancyId={activePregnancy.id}
                                currentRiskLevel={activePregnancy.riskLevel}
                                editable={true}
                            />
                        ) : (
                            <Badge variant="secondary">Not Assessed</Badge>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vitals</CardTitle>
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vitals?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Recorded entries</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {vitalsWithAlerts.reduce((acc: number, v: any) => acc + v.alerts.filter((a: any) => !a.acknowledged).length, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">Unacknowledged</p>
                    </CardContent>
                </Card>
            </div>

            {/* Vitals Chart */}
            {vitals && vitals.length > 0 && (
                <PatientVitalsChart vitals={vitals} />
            )}

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Alerts */}
                {vitalsWithAlerts.length > 0 && (
                    <PatientAlertList vitals={vitalsWithAlerts} />
                )}

                {/* Medical Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Medical Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {notes && notes.length > 0 ? (
                            <div className="space-y-3">
                                {notes.slice(0, 5).map((note: any) => (
                                    <div key={note.id} className="p-3 border rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline">{note.category}</Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(note.createdAt), "MMM dd, yyyy")}
                                            </span>
                                        </div>
                                        <p className="text-sm">{note.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No medical notes yet.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Appointments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {patient.appointments && patient.appointments.length > 0 ? (
                            <div className="space-y-3">
                                {patient.appointments.map((appointment: any) => (
                                    <div key={appointment.id} className="p-3 border rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium">{appointment.purpose || "General Checkup"}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(appointment.date).toLocaleDateString()} at{" "}
                                                    {new Date(appointment.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <Badge variant={appointment.status === "COMPLETED" ? "default" : appointment.status === "CANCELLED" ? "destructive" : "secondary"}>
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                        {appointment.notes && (
                                            <p className="text-sm text-muted-foreground mt-2">{appointment.notes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">No appointments scheduled.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Reports */}
            <Card>
                <CardHeader>
                    <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    {patient.reports && patient.reports.length > 0 ? (
                        <div className="space-y-2">
                            {patient.reports.map((report: any) => (
                                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{report.title || report.type}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {report.category && `${report.category} | `}
                                                Uploaded: {new Date(report.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                                            View
                                        </a>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No reports uploaded.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
