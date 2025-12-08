"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { addMedicalNote } from "@/server/actions/doctor"
import { Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface MedicalNoteFormProps {
    patientId: string
    patientName: string
}

const NOTE_CATEGORIES = [
    { value: "GENERAL", label: "General" },
    { value: "VITAL_REVIEW", label: "Vital Review" },
    { value: "CONSULTATION", label: "Consultation" },
    { value: "PRESCRIPTION", label: "Prescription" },
    { value: "LAB_RESULT", label: "Lab Result" },
    { value: "FOLLOW_UP", label: "Follow-up" },
]

export function MedicalNoteForm({ patientId, patientName }: MedicalNoteFormProps) {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("GENERAL")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!content.trim()) {
            toast.error("Please enter note content")
            return
        }

        setIsSubmitting(true)

        try {
            const result = await addMedicalNote({
                patientId,
                content: content.trim(),
                category,
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Medical note added successfully")
                setContent("")
                setCategory("GENERAL")
                setOpen(false)
                router.refresh()
            }
        } catch (error) {
            toast.error("Failed to add medical note")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Note
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Medical Note</DialogTitle>
                        <DialogDescription>
                            Add a medical note for {patientName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {NOTE_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="content">Note Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Enter your medical note here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={8}
                                required
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
                            Save Note
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
