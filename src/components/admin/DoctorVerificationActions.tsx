"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { verifyDoctor } from "@/server/actions/admin"
import { useToast } from "@/components/ui/use-toast"

interface DoctorVerificationActionsProps {
    doctorId: string
    doctorName: string
}

export function DoctorVerificationActions({ doctorId, doctorName }: DoctorVerificationActionsProps) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleVerify = async (approved: boolean) => {
        if (!confirm(`Are you sure you want to ${approved ? 'approve' : 'reject'} Dr. ${doctorName}?`)) return

        setLoading(true)
        try {
            const result = await verifyDoctor(doctorId, approved)
            if (result.success) {
                toast({
                    title: approved ? "Doctor Approved" : "Doctor Rejected",
                    description: `Dr. ${doctorName} has been ${approved ? 'verified' : 'rejected'}.`,
                    variant: approved ? "default" : "destructive"
                })
            } else {
                throw new Error(result.error || "Failed to verify")
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update doctor status",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex gap-2">
            <Button
                size="sm"
                variant="outline"
                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                onClick={() => handleVerify(true)}
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                Approve
            </Button>
            <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={() => handleVerify(false)}
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                Reject
            </Button>
        </div>
    )
}
