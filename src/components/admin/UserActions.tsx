"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2, Shield, UserCog, Loader2 } from "lucide-react"
import { deleteUser, updateUserRole } from "@/server/actions/admin"
import { useToast } from "@/components/ui/use-toast"
import { UserRole } from "@prisma/client"

interface UserActionsProps {
    userId: string
    userName: string
    currentRole: UserRole
}

export function UserActions({ userId, userName, currentRole }: UserActionsProps) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete user ${userName}? This action cannot be undone.`)) return

        setLoading(true)
        try {
            const result = await deleteUser(userId)
            if (result.success) {
                toast({ title: "User Deleted", description: `${userName} has been removed.` })
            } else {
                throw new Error(result.error || "Failed to delete")
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete user", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleRoleChange = async (newRole: UserRole) => {
        if (!confirm(`Change role of ${userName} to ${newRole}?`)) return

        setLoading(true)
        try {
            const result = await updateUserRole(userId, newRole)
            if (result.success) {
                toast({ title: "Role Updated", description: `${userName} is now a ${newRole}.` })
            } else {
                throw new Error(result.error || "Failed to update role")
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update role", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(userId)}>
                    Copy User ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleRoleChange("PATIENT")} disabled={currentRole === "PATIENT"}>
                    <UserCog className="mr-2 h-4 w-4" /> Make Patient
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange("DOCTOR")} disabled={currentRole === "DOCTOR"}>
                    <Shield className="mr-2 h-4 w-4" /> Make Doctor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange("ADMIN")} disabled={currentRole === "ADMIN"}>
                    <Shield className="mr-2 h-4 w-4 text-red-500" /> Make Admin
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
