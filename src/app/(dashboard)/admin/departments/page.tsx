import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

export default async function DepartmentsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Departments & Clinics</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Coming Soon
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        The Departments feature is currently unavailable.
                        This feature requires database migration to add the Department model.
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                        For now, you can:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                        <li>Manage doctors from the Doctors page</li>
                        <li>Manage patients from the Patients page</li>
                        <li>View system statistics on the dashboard</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
