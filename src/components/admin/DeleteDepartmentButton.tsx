"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteDepartment } from "@/server/actions/admin"
import { useToast } from "@/components/ui/use-toast"

interface DeleteDepartmentButtonProps {
    departmentId: string
    departmentName: string
}

export function DeleteDepartmentButton({ departmentId, departmentName }: DeleteDepartmentButtonProps) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${departmentName}? This action cannot be undone.`)) return

        setLoading(true)
        try {
            const result = await deleteDepartment(departmentId)
            if (result.success) {
                toast({
                    title: "Department Deleted",
                    description: `${departmentName} has been removed.`,
                })
            } else {
                throw new Error(result.error || "Failed to delete")
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete department",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </Button>
    )
}
