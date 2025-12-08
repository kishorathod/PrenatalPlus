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
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { createDepartment } from "@/server/actions/admin"
import { useToast } from "@/components/ui/use-toast"

export function AddDepartmentDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get("name") as string,
            description: formData.get("description") as string || undefined,
            location: formData.get("location") as string || undefined,
            headDoctor: formData.get("headDoctor") as string || undefined,
            contactPhone: formData.get("contactPhone") as string || undefined,
        }

        try {
            const result = await createDepartment(data)
            if (result.success) {
                toast({
                    title: "Department Created",
                    description: `${data.name} has been added successfully.`,
                })
                setOpen(false)
                e.currentTarget.reset()
            } else {
                throw new Error(result.error || "Failed to create department")
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create department",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Department</DialogTitle>
                        <DialogDescription>
                            Create a new department or clinic unit.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Department Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., Obstetrics & Gynecology"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Brief description of the department"
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="e.g., Building A, 3rd Floor"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="headDoctor">Head Doctor</Label>
                            <Input
                                id="headDoctor"
                                name="headDoctor"
                                placeholder="e.g., Dr. Sarah Johnson"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <Input
                                id="contactPhone"
                                name="contactPhone"
                                type="tel"
                                placeholder="e.g., +1 (555) 123-4567"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Create Department
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
