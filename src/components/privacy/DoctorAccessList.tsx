"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { grantDoctorAccess, revokeDoctorAccess, denyDoctorAccess } from "@/server/actions/patient-consent"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, User, Building2, Award, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

type Assignment = {
    id: string
    consentStatus: string
    consentGrantedAt: Date | null
    consentRevokedAt: Date | null
    revokeReason: string | null
    doctor: {
        id: string
        name: string | null
        email: string
        specialization: string | null
        hospitalClinic: string | null
        yearsOfExperience: number | null
    }
    pregnancy: {
        id: string
        currentWeek: number
        dueDate: Date
    } | null
}

type DoctorAccessListProps = {
    assignments: Assignment[]
    type: "pending" | "granted" | "revoked"
}

export function DoctorAccessList({ assignments, type }: DoctorAccessListProps) {
    const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
    const [revokeReason, setRevokeReason] = useState("")
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleGrant = async (assignmentId: string) => {
        setLoading(true)
        const result = await grantDoctorAccess(assignmentId)
        setLoading(false)

        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Access Granted",
                description: "Doctor can now access your medical information"
            })
            router.refresh()
        }
    }

    const handleDeny = async (assignmentId: string) => {
        setLoading(true)
        const result = await denyDoctorAccess(assignmentId)
        setLoading(false)

        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Request Denied",
                description: "Access request has been denied"
            })
            router.refresh()
        }
    }

    const handleRevoke = async () => {
        if (!selectedAssignment) return

        setLoading(true)
        const result = await revokeDoctorAccess(selectedAssignment.id, revokeReason || undefined)
        setLoading(false)
        setRevokeDialogOpen(false)
        setRevokeReason("")

        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Access Revoked",
                description: "Doctor can no longer access your data"
            })
            router.refresh()
        }
    }

    return (
        <>
            <div className="space-y-4">
                {assignments.map((assignment) => (
                    <Card key={assignment.id} className="border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-blue-50 rounded-full">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-slate-800">
                                                {assignment.doctor.name || "Unknown Doctor"}
                                            </h3>
                                            <p className="text-sm text-slate-500">{assignment.doctor.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                                        {assignment.doctor.specialization && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Award className="h-4 w-4 text-slate-400" />
                                                <span>{assignment.doctor.specialization}</span>
                                            </div>
                                        )}
                                        {assignment.doctor.hospitalClinic && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Building2 className="h-4 w-4 text-slate-400" />
                                                <span>{assignment.doctor.hospitalClinic}</span>
                                            </div>
                                        )}
                                        {assignment.consentGrantedAt && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Calendar className="h-4 w-4 text-slate-400" />
                                                <span>Since {new Date(assignment.consentGrantedAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {assignment.revokeReason && (
                                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                            <p className="text-sm text-slate-600">
                                                <span className="font-medium">Reason: </span>
                                                {assignment.revokeReason}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="ml-4 flex flex-col gap-2">
                                    {type === "pending" && (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={() => handleGrant(assignment.id)}
                                                disabled={loading}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDeny(assignment.id)}
                                                disabled={loading}
                                                className="border-red-200 text-red-600 hover:bg-red-50"
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Deny
                                            </Button>
                                        </>
                                    )}
                                    {type === "granted" && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                                setSelectedAssignment(assignment)
                                                setRevokeDialogOpen(true)
                                            }}
                                            disabled={loading}
                                        >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Revoke Access
                                        </Button>
                                    )}
                                    {type === "revoked" && (
                                        <Badge variant="secondary" className="bg-slate-100">
                                            Revoked
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Revoke Confirmation Dialog */}
            <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Revoke Doctor Access?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedAssignment?.doctor.name} will no longer be able to view your medical information.
                            You can provide an optional reason below.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Textarea
                        placeholder="Reason for revoking access (optional)"
                        value={revokeReason}
                        onChange={(e) => setRevokeReason(e.target.value)}
                        className="mt-2"
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRevoke}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Revoke Access
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
