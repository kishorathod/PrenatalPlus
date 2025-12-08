"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, Pill, Trash2, AlertCircle } from "lucide-react"
import { logMedicationIntake, deleteMedicationReminder, toggleMedicationStatus } from "@/server/actions/medications"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface MedicationListProps {
    reminders: any[]
}

export function MedicationList({ reminders }: MedicationListProps) {
    const { toast } = useToast()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleTake = async (id: string) => {
        setLoadingId(id)
        try {
            const result = await logMedicationIntake(id, true)
            if (result.success) {
                toast({
                    title: "Recorded",
                    description: "Medication marked as taken",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to record intake",
                variant: "destructive",
            })
        } finally {
            setLoadingId(null)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteMedicationReminder(id)
            toast({
                title: "Deleted",
                description: "Reminder removed",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete reminder",
                variant: "destructive",
            })
        }
    }

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            await toggleMedicationStatus(id, !currentStatus)
            toast({
                title: currentStatus ? "Paused" : "Resumed",
                description: `Reminder ${currentStatus ? "paused" : "resumed"}`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive",
            })
        }
    }

    if (reminders.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                <Pill className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No medications</h3>
                <p className="text-gray-500">Add your first medication reminder to get started</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reminders.map((reminder) => {
                const todayLog = reminder.logs?.[0]
                const isTakenToday = !!todayLog?.taken

                return (
                    <Card key={reminder.id} className={cn("relative transition-all", !reminder.isActive && "opacity-75 bg-gray-50")}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className={cn("p-2 rounded-lg", isTakenToday ? "bg-green-100" : "bg-blue-100")}>
                                        <Pill className={cn("h-5 w-5", isTakenToday ? "text-green-600" : "text-blue-600")} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{reminder.name}</CardTitle>
                                        <p className="text-sm text-gray-500">{reminder.dosage}</p>
                                    </div>
                                </div>
                                <Badge variant={reminder.isActive ? "outline" : "secondary"}>
                                    {reminder.isActive ? "Active" : "Paused"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        {reminder.frequency === "AS_NEEDED"
                                            ? "As needed"
                                            : reminder.timeOfDay.join(", ")}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1"
                                        variant={isTakenToday ? "outline" : "default"}
                                        disabled={!reminder.isActive || isTakenToday || loadingId === reminder.id}
                                        onClick={() => handleTake(reminder.id)}
                                    >
                                        {isTakenToday ? (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Taken Today
                                            </>
                                        ) : (
                                            "Mark as Taken"
                                        )}
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Reminder?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete this medication reminder and its history.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(reminder.id)} className="bg-destructive hover:bg-destructive/90">
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
