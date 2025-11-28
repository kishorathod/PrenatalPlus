import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPatientDetails, getPatientVitalsHistory } from "@/server/actions/doctor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Activity, FileText, ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/server/auth"

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
    // Server-side authorization check
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        redirect("/login?role=doctor")
    }

    const { patient } = await getPatientDetails(params.id)
    const { vitals } = await getPatientVitalsHistory(params.id)

    if (!patient) {
        notFound()
    }

    const activePregnancy = patient.pregnancies[0]

    return (
        <div className="p-6 space-y-6">
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
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Note
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
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
                        {activePregnancy ? (
                            <Badge variant="secondary">
                                N/A
                            </Badge>
                        ) : (
                            <p className="text-sm text-muted-foreground">N/A</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vitals</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vitals?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Recorded entries</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Vitals History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-muted-foreground py-8">
                            Vitals history temporarily unavailable.
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {patient.appointments && patient.appointments.length > 0 ? (
                            <div className="space-y-3">
                                {patient.appointments.map((appointment) => (
                                    <div key={appointment.id} className="p-3 border rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium">{appointment.purpose || "General Checkup"}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(appointment.appointmentDate).toLocaleDateString()} at{" "}
                                                    {new Date(appointment.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
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

            <Card>
                <CardHeader>
                    <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    {patient.reports && patient.reports.length > 0 ? (
                        <div className="space-y-2">
                            {patient.reports.map((report) => (
                                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{report.reportType}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Uploaded: {new Date(report.uploadedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">View</Button>
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
