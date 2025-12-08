import { Metadata } from "next"
import { SettingsForm } from "@/components/features/settings/SettingsForm"

export const metadata: Metadata = {
    title: "Settings | PrenatalPlus",
    description: "Manage your account settings and preferences",
}

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>
            <div className="max-w-2xl">
                <SettingsForm />
            </div>
        </div>
    )
}
