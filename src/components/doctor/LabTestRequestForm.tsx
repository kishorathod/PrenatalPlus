"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { requestLabTest } from "@/server/actions/doctor"
import { FlaskConical, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface LabTestRequestFormProps {
    patientId: string
    pregnancyId?: string
    patientName: string
}

const LAB_TEST_TYPES = [
    { value: "BLOOD_TEST", label: "Blood Test" },
    { value: "URINE_TEST", label: "Urine Test" },
    { value: "ULTRASOUND", label: "Ultrasound" },
    { value: "GLUCOSE_TOLERANCE", label: "Glucose Tolerance Test" },
    { value: "GENETIC_SCREENING", label: "Genetic Screening" },
    { value: "THYROID_FUNCTION", label: "Thyroid Function Test" },
    { value: "IRON_STUDIES", label: "Iron Studies" },
    { value: "OTHER", label: "Other" },
]

const URGENCY_LEVELS = [
    { value: "ROUTINE", label: "Routine" },
    { value: "URGENT", label: "Urgent" },
    { value: "EMERGENCY", label: "Emergency" },
]

export function LabTestRequestForm({ patientId, pregnancyId, patientName }: LabTestRequestFormProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        testType: "BLOOD_TEST",
        testName: "",
        description: "",
        urgency: "ROUTINE",
    })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.testName) {
            toast.error("Please enter a test name")
            return
        }

        setIsSubmitting(true)

        try {
            const result = await requestLabTest({
                patientId,
                pregnancyId,
                testType: formData.testType,
                testName: formData.testName,
                description: formData.description || undefined,
                urgency: formData.urgency as "ROUTINE" | "URGENT" | "EMERGENCY",
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Lab test requested successfully")
                setFormData({
                    testType: "BLOOD_TEST",
                    testName: "",
                    description: "",
                    urgency: "ROUTINE",
                })
                setOpen(false)
                router.refresh()
            }
        } catch (error) {
            toast.error("Failed to request lab test")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FlaskConical className="mr-2 h-4 w-4" />
                    Request Test
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Request Lab Test</DialogTitle>
                        <DialogDescription>
                            Request a laboratory test for {patientName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="testType">Test Type *</Label>
                            <Select value={formData.testType} onValueChange={(value) => setFormData({ ...formData, testType: value })}>
                                <SelectTrigger id="testType">
                                    <SelectValue placeholder="Select test type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LAB_TEST_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="testName">Test Name *</Label>
                            <Input
                                id="testName"
                                placeholder="e.g., Complete Blood Count, Glucose Screen"
                                value={formData.testName}
                                onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="urgency">Urgency</Label>
                            <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                                <SelectTrigger id="urgency">
                                    <SelectValue placeholder="Select urgency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {URGENCY_LEVELS.map((level) => (
                                        <SelectItem key={level.value} value={level.value}>
                                            {level.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description/Notes</Label>
                            <Textarea
                                id="description"
                                placeholder="Additional notes or specific requirements for the test..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
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
                            Request Test
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
