import { redirect } from "next/navigation"
import { auth } from "@/server/auth"
import { getMyDoctorAccess } from "@/server/actions/patient-consent"
import { DoctorAccessList } from "@/components/privacy/DoctorAccessList"
import { Shield, Lock } from "lucide-react"

export default async function PrivacyPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    const { assignments, error } = await getMyDoctorAccess()

    const grantedAccess = assignments.filter(a => a.consentStatus === "GRANTED")
    const pendingRequests = assignments.filter(a => a.consentStatus === "PENDING")
    const revokedAccess = assignments.filter(a => a.consentStatus === "REVOKED")

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">Privacy & Data Access</h1>
                </div>
                <p className="text-slate-600">
                    Manage which doctors can access your medical information
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Lock className="h-5 w-5 text-orange-600" />
                        <h2 className="text-xl font-semibold text-slate-800">
                            Pending Access Requests ({pendingRequests.length})
                        </h2>
                    </div>
                    <DoctorAccessList assignments={pendingRequests} type="pending" />
                </div>
            )}

            {/* Granted Access */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                    Doctors with Access ({grantedAccess.length})
                </h2>
                {grantedAccess.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                        <Shield className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-600">No doctors currently have access to your data</p>
                    </div>
                ) : (
                    <DoctorAccessList assignments={grantedAccess} type="granted" />
                )}
            </div>

            {/* Revoked Access */}
            {revokedAccess.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">
                        Revoked Access ({revokedAccess.length})
                    </h2>
                    <DoctorAccessList assignments={revokedAccess} type="revoked" />
                </div>
            )}
        </div>
    )
}
