import { Suspense } from "react"
import { LoginContent } from "@/components/features/auth/LoginContent"
import { checkAnyAdminExists } from "@/server/actions/admin"
import { UserRole } from "@prisma/client"

export default async function PatientLoginPage() {
    const adminExists = await checkAnyAdminExists()

    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mx-auto"></div>
                </div>
            </div>
        }>
            <LoginContent allowAdminRegister={!adminExists} fixedRole="PATIENT" />
        </Suspense>
    )
}
