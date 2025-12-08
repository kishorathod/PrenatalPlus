"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { createPrescription } from "@/server/actions/doctor"
import { Pill, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface PrescriptionFormProps {
    patientId: string
    pregnancyId?: string
    patientName: string
}

export function PrescriptionForm({ patientId, pregnancyId, patientName }: PrescriptionFormProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        reason: "",
        sideEffects: "",
    })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.medication || !formData.dosage || !formData.frequency || !formData.duration) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)

        try {
            const result = await createPrescription({
                patientId,
                pregnancyId,
                ...formData,
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Prescription created successfully")
                setFormData({
                    medication: "",
                    dosage: "",
                    frequency: "",
                    duration: "",
                    instructions: "",
                    reason: "",
                    sideEffects: "",
                })
                setOpen(false)
                router.refresh()
            }
        } catch (error) {
            toast.error("Failed to create prescription")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Pill className="mr-2 h-4 w-4" />
                    Prescribe
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Prescription</DialogTitle>
                        <DialogDescription>
                            Create a new prescription for {patientName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="medication">Medication Name *</Label>
                            <Input
                                id="medication"
                                placeholder="e.g., Prenatal Vitamins"
                                value={formData.medication}
                                onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="dosage">Dosage *</Label>
                                <Input
                                    id="dosage"
                                    placeholder="e.g., 500mg"
                                    value={formData.dosage}
                                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="frequency">Frequency *</Label>
                                <Input
                                    id="frequency"
                                    placeholder="e.g., Twice daily"
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="duration">Duration *</Label>
                            <Input
                                id="duration"
                                placeholder="e.g., 30 days, Until delivery"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Reason for Prescription</Label>
                            <Input
                                id="reason"
                                placeholder="e.g., Iron deficiency, Prenatal nutrition"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="instructions">Special Instructions</Label>
                            <Textarea
                                id="instructions"
                                placeholder="e.g., Take with food, Avoid taking with calcium supplements"
                                value={formData.instructions}
                                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sideEffects">Possible Side Effects</Label>
                            <Textarea
                                id="sideEffects"
                                placeholder="e.g., Nausea, constipation - contact if severe"
                                value={formData.sideEffects}
                                onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Prescription
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
