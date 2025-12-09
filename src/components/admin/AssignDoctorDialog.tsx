"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { assignDoctorToPatient } from "@/server/actions/admin"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { UserPlus } from "lucide-react"

type Doctor = {
    id: string
    name: string | null
    email: string
    specialization: string | null
    hospitalClinic: string | null
}

type AssignDoctorDialogProps = {
    patientId: string
    patientName: string | null
    pregnancyId?: string
    doctors: Doctor[]
}

export function AssignDoctorDialog({ patientId, patientName, pregnancyId, doctors }: AssignDoctorDialogProps) {
    const [open, setOpen] = useState(false)
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleAssign = async () => {
        if (!selectedDoctorId) {
            toast({
                title: "Error",
                description: "Please select a doctor",
                variant: "destructive"
            })
            return
        }

        setLoading(true)
        const result = await assignDoctorToPatient({
            patientId,
            doctorId: selectedDoctorId,
            pregnancyId
        })
        setLoading(false)

        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Success",
                description: "Doctor assigned successfully"
            })
            setOpen(false)
            setSelectedDoctorId("")
            router.refresh()
        }
    }

    return (
        <>
            <Button
                size="sm"
                variant="outline"
                onClick={() => setOpen(true)}
                className="gap-2"
            >
                <UserPlus className="h-4 w-4" />
                Assign Doctor
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Doctor to Patient</DialogTitle>
                        <DialogDescription>
                            Select a doctor to assign to {patientName || "this patient"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map((doctor) => (
                                    <SelectItem key={doctor.id} value={doctor.id}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{doctor.name || doctor.email}</span>
                                            {doctor.specialization && (
                                                <span className="text-xs text-muted-foreground">
                                                    {doctor.specialization}
                                                </span>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAssign} disabled={loading}>
                            {loading ? "Assigning..." : "Assign Doctor"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
