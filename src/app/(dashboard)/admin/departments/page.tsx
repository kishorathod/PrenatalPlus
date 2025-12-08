import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getDepartments } from "@/server/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Phone, User, Trash2 } from "lucide-react"
import { AddDepartmentDialog } from "@/components/admin/AddDepartmentDialog"
import { Button } from "@/components/ui/button"
import { DeleteDepartmentButton } from "@/components/admin/DeleteDepartmentButton"

export default async function DepartmentsPage() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login/admin")
    }

    const { departments } = await getDepartments()

    return (
        <div className="container mx-auto px-6 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-blue-500" />
                        Departments
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage hospital departments and clinics
                    </p>
                </div>
                <AddDepartmentDialog />
            </div>

            {departments && departments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {departments.map((dept) => (
                        <Card key={dept.id} className="relative">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Building2 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{dept.name}</CardTitle>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {dept._count?.doctors || 0} doctors
                                            </p>
                                        </div>
                                    </div>
                                    <DeleteDepartmentButton
                                        departmentId={dept.id}
                                        departmentName={dept.name}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {dept.description && (
                                    <p className="text-sm text-gray-600">{dept.description}</p>
                                )}
                                {dept.location && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin className="h-4 w-4" />
                                        {dept.location}
                                    </div>
                                )}
                                {dept.headDoctor && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <User className="h-4 w-4" />
                                        {dept.headDoctor}
                                    </div>
                                )}
                                {dept.contactPhone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Phone className="h-4 w-4" />
                                        {dept.contactPhone}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-dashed border-2 bg-gray-50">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <Building2 className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No departments yet
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Get started by creating your first department
                        </p>
                        <AddDepartmentDialog />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
