import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPatients } from "@/server/actions/admin"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function PatientsPage() {
    const { patients, error } = await getPatients()

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Manage Patients</h1>

            <Card>
                <CardHeader>
                    <CardTitle>All Patients</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search patients..." className="max-w-sm" />
                    </div>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <div className="space-y-4">
                            {patients?.map((patient) => (
                                <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarFallback>{patient.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{patient.name}</p>
                                            <p className="text-sm text-muted-foreground">{patient.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {patient.pregnancies[0] ? (
                                            <Badge variant={patient.pregnancies[0].riskLevel === 'HIGH' ? 'destructive' : 'secondary'}>
                                                Week {patient.pregnancies[0].currentWeek}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">Not Pregnant</Badge>
                                        )}
                                        <Button variant="ghost" size="sm">View Details</Button>
                                    </div>
                                </div>
                            ))}
                            {patients?.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">
                                    No patients found.
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
