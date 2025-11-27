import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { AddAdminDialog } from "@/components/features/admin/AddAdminDialog"

export default function SettingsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Admin Settings</h1>
                <AddAdminDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>System Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Maintenance Mode</Label>
                                <p className="text-sm text-muted-foreground">Disable access for non-admin users</p>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>New User Registration</Label>
                                <p className="text-sm text-muted-foreground">Allow new patients to register</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Roles & Permissions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium">Admin</h3>
                            <p className="text-sm text-muted-foreground">Full access to all system features</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium">Doctor</h3>
                            <p className="text-sm text-muted-foreground">Manage patients, appointments, and medical records</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium">Patient</h3>
                            <p className="text-sm text-muted-foreground">View own records, book appointments</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
