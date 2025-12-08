"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowLeft, Activity } from "lucide-react"
import { useState, useEffect } from "react"
import { getDoctorPatients, getPatientVitalsHistory } from "@/server/actions/doctor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PatientVitalsChart } from "@/components/doctor/PatientVitalsChart"
import { PatientAlertList } from "@/components/doctor/PatientAlertList"
import { Badge } from "@/components/ui/badge"

export default function DoctorVitalsPage() {
    const [patients, setPatients] = useState<any[]>([])
    const [selectedPatient, setSelectedPatient] = useState<any>(null)
    const [vitals, setVitals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingVitals, setLoadingVitals] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Fetch patients on mount
    useEffect(() => {
        async function fetchPatients() {
            const { patients: fetchedPatients } = await getDoctorPatients()
            setPatients(fetchedPatients || [])
            setLoading(false)
        }
        fetchPatients()
    }, [])

    // Fetch vitals when patient is selected
    const handleSelectPatient = async (patient: any) => {
        setSelectedPatient(patient)
        setLoadingVitals(true)
        const { vitals: fetchedVitals } = await getPatientVitalsHistory(patient.id)
        setVitals(fetchedVitals || [])
        setLoadingVitals(false)
    }

    const filteredPatients = patients.filter(patient =>
        patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (selectedPatient) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setSelectedPatient(null)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.email}`} />
                            <AvatarFallback>{selectedPatient.name?.[0] || "P"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold">{selectedPatient.name}</h1>
                            <p className="text-muted-foreground">Vitals History</p>
                        </div>
                    </div>
                </div>

                {loadingVitals ? (
                    <div className="flex justify-center py-12">
                        <Activity className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{vitals.length}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Latest BP</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {vitals[0]?.systolic ? `${vitals[0].systolic}/${vitals[0].diastolic}` : "N/A"}
                                    </div>
                                    <p className="text-xs text-muted-foreground">mmHg</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Latest Weight</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {vitals[0]?.weight ? `${vitals[0].weight} kg` : "N/A"}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <PatientVitalsChart vitals={vitals} />

                        <div className="grid gap-6 md:grid-cols-2">
                            <PatientAlertList vitals={vitals.filter(v => v.alerts && v.alerts.length > 0)} />

                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {vitals.slice(0, 5).map((vital) => (
                                            <div key={vital.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">
                                                        {new Date(vital.recordedAt).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Week {vital.pregnancy?.currentWeek || "?"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    {vital.systolic && (
                                                        <p className="text-sm">BP: {vital.systolic}/{vital.diastolic}</p>
                                                    )}
                                                    {vital.weight && (
                                                        <p className="text-sm text-muted-foreground">Weight: {vital.weight}kg</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Patient Vitals History</h1>

            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search patient to view vitals..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select Patient</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center py-8 text-muted-foreground">Loading patients...</p>
                    ) : filteredPatients.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    onClick={() => handleSelectPatient(patient)}
                                    className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                                >
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.email}`} />
                                        <AvatarFallback>{patient.name?.[0] || "P"}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{patient.name}</p>
                                        <p className="text-sm text-muted-foreground truncate max-w-[150px]">{patient.email}</p>
                                        {patient.pregnancies?.[0] && (
                                            <Badge variant="outline" className="mt-2">
                                                Week {patient.pregnancies[0].currentWeek}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-8 text-muted-foreground">
                            {searchQuery ? "No patients found matching your search." : "No patients available."}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
