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
import { Plus, ShieldCheck } from "lucide-react"
import { createAdmin } from "@/server/actions/admin"
import { useToast } from "@/components/ui/use-toast"

export function AddAdminDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData)

        const result = await createAdmin(data)

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            })
        } else {
            toast({
                title: "Success",
                description: "Admin created successfully",
            })
            setOpen(false)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Add New Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Admin</DialogTitle>
                        <DialogDescription>
                            Create a new administrator account. They will have full access to the system.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" name="name" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input id="email" name="email" type="email" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <Input id="password" name="password" type="password" className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Admin"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
