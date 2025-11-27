import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDoctors } from "@/server/actions/admin"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AddDoctorDialog } from "@/components/features/admin/AddDoctorDialog"

export default async function DoctorsPage() {
    const { doctors, error } = await getDoctors()

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Doctors</h1>
                <AddDoctorDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Medical Staff</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search doctors..." className="max-w-sm" />
                    </div>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <div className="space-y-4">
                            {doctors?.map((doctor) => (
                                <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarFallback>{doctor.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{doctor.name}</p>
                                            <p className="text-sm text-muted-foreground">{doctor.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-muted-foreground">
                                            {doctor._count.appointments} appointments
                                        </div>
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </div>
                                </div>
                            ))}
                            {doctors?.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">
                                    No doctors found. Add one to get started.
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
