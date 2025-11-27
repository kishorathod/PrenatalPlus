import { Metadata } from "next"
import { ProfileForm } from "@/components/features/profile/ProfileForm"

export const metadata: Metadata = {
    title: "Profile | MotherCare+",
    description: "Manage your profile information",
}

export default function ProfilePage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
            </div>
            <div className="max-w-2xl">
                <ProfileForm />
            </div>
        </div>
    )
}
