import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUnverifiedDoctors, getAllUsers } from "@/server/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Mail, Calendar, Stethoscope, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { DoctorVerificationActions } from "@/components/admin/DoctorVerificationActions"
import { Input } from "@/components/ui/input"

export default async function AdminDoctorsPage() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login/admin")
    }

    const [{ doctors: pendingDoctors }, { users: allDoctors }] = await Promise.all([
        getUnverifiedDoctors(),
        getAllUsers("DOCTOR")
    ])

    // Filter out pending doctors from all doctors list if they overlap (though getAllUsers might return all)
    // Actually getAllUsers returns all, so we might want to filter or just show "Verified" status.
    const verifiedDoctors = allDoctors?.filter(d => d.isVerified) || []

    return (
        <div className="container mx-auto px-6 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-orange-500" />
                    Doctor Management
                </h1>
                <p className="text-gray-600 mt-1">
                    Verify new registrations and manage medical staff
                </p>
            </div>

            {/* Pending Verifications Section */}
            {pendingDoctors && pendingDoctors.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-orange-500" />
                        Pending Approval ({pendingDoctors.length})
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pendingDoctors.map((doctor) => (
                            <Card key={doctor.id} className="overflow-hidden border-orange-200">
                                <CardHeader className="bg-orange-50 pb-8">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="bg-white text-orange-600 border-orange-200">
                                            Pending
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                            Joined {formatDistanceToNow(new Date(doctor.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 relative">
                                    <div className="absolute -top-6 left-6">
                                        <Avatar className="h-12 w-12 border-4 border-white shadow-sm">
                                            <AvatarImage src={doctor.avatar || ""} />
                                            <AvatarFallback>{doctor.name?.[0] || "D"}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="mt-8 space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-lg">{doctor.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <Mail className="h-3 w-3" />
                                                {doctor.email}
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t">
                                            <DoctorVerificationActions
                                                doctorId={doctor.id}
                                                doctorName={doctor.name || "Doctor"}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* All Doctors List */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-blue-500" />
                        Medical Staff ({verifiedDoctors.length})
                    </h2>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search doctors..." className="max-w-sm h-9" />
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {verifiedDoctors.length > 0 ? (
                                verifiedDoctors.map((doctor) => (
                                    <div key={doctor.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={doctor.avatar || ""} />
                                                <AvatarFallback>{doctor.name?.[0] || "D"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{doctor.name}</p>
                                                    {doctor.isVerified && (
                                                        <Badge variant="secondary" className="h-5 text-[10px] bg-green-100 text-green-700 hover:bg-green-100">
                                                            Verified
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">{doctor.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>Joined {new Date(doctor.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ShieldCheck className="h-4 w-4" />
                                                <span>{doctor._count?.doctorAppointments || 0} appointments</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No verified doctors found.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
