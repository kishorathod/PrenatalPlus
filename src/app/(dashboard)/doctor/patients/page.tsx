import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus, Calendar as CalendarIcon, AlertCircle, Activity } from "lucide-react"
import { getDoctorPatients } from "@/server/actions/doctor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { auth } from "@/server/auth"
import { redirect } from "next/navigation"

export default async function DoctorPatientsPage() {
    // Server-side authorization check
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
        redirect("/login?role=doctor")
    }

    const { patients } = await getDoctorPatients()

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Patients</h1>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Patient
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search patients..." className="pl-8" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {patients?.map((patient: any) => {
                    const activePregnancy = patient.pregnancies?.[0]
                    // Use vitalReadings and optional chaining as it might be missing
                    const latestVital = patient.vitalReadings?.[0]
                    const hasHighBP = latestVital && (latestVital.bloodPressureSystolic > 140 || latestVital.bloodPressureDiastolic > 90)

                    return (
                        <Link key={patient.id} href={`/doctor/patients/${patient.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.email}`} />
                                        <AvatarFallback>{patient.name?.[0] || "P"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col flex-1">
                                        <CardTitle className="text-base">{patient.name}</CardTitle>
                                        <p className="text-xs text-muted-foreground">{patient.email}</p>
                                    </div>
                                    {hasHighBP && (
                                        <Activity className="h-4 w-4 text-red-500" />
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        {activePregnancy ? (
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Status:</span>
                                                    <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                                                        Week {activePregnancy.currentWeek}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Due Date:</span>
                                                    <div className="flex items-center">
                                                        <CalendarIcon className="mr-1 h-3 w-3 text-muted-foreground" />
                                                        <span>{new Date(activePregnancy.dueDate).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Risk Level:</span>
                                                    <Badge variant="secondary">
                                                        N/A
                                                    </Badge>
                                                </div>
                                                {latestVital && (
                                                    <div className="flex justify-between items-center pt-2 border-t">
                                                        <span className="text-muted-foreground">Latest BP:</span>
                                                        <span className={hasHighBP ? "text-red-600 font-medium" : ""}>
                                                            {latestVital.bloodPressureSystolic}/{latestVital.bloodPressureDiastolic}
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="flex items-center text-muted-foreground py-2">
                                                <AlertCircle className="mr-2 h-4 w-4" />
                                                No active pregnancy
                                            </div>
                                        )}
                                        <div className="pt-2 mt-2 border-t flex justify-between text-xs text-muted-foreground">
                                            <span>Appointments: {patient._count?.appointments || 0}</span>
                                            <span>Vitals: {patient._count?.vitalReadings || 0}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
                {(!patients || patients.length === 0) && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No patients found.
                    </div>
                )}
            </div>
        </div>
    )
}
