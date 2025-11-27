import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default async function LogsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">System Logs</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Coming Soon
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        The System Logs feature is currently unavailable.
                        This feature requires database migration to add the SystemLog model.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
