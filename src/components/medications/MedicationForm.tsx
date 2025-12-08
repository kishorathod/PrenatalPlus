"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createMedicationReminder } from "@/server/actions/medications"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, X } from "lucide-react"
import { MedicationFrequency } from "@prisma/client"

const medicationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    dosage: z.string().min(1, "Dosage is required"),
    frequency: z.nativeEnum(MedicationFrequency),
    startDate: z.string(),
    endDate: z.string().optional(),
})

interface MedicationFormProps {
    onSuccess?: () => void
    onCancel?: () => void
}

export function MedicationForm({ onSuccess, onCancel }: MedicationFormProps) {
    const { toast } = useToast()
    const [times, setTimes] = useState<string[]>(["09:00"])

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof medicationSchema>>({
        resolver: zodResolver(medicationSchema),
        defaultValues: {
            frequency: "DAILY" as MedicationFrequency,
            startDate: new Date().toISOString().split("T")[0],
        },
    })

    const frequency = watch("frequency")

    const addTime = () => {
        setTimes([...times, "09:00"])
    }

    const removeTime = (index: number) => {
        setTimes(times.filter((_, i) => i !== index))
    }

    const updateTime = (index: number, value: string) => {
        const newTimes = [...times]
        newTimes[index] = value
        setTimes(newTimes)
    }

    const onSubmit = async (data: any) => {
        try {
            const result = await createMedicationReminder({
                ...data,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                timeOfDay: times,
            })

            if (result.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                })
                return
            }

            toast({
                title: "Success",
                description: "Medication reminder created successfully",
            })
            onSuccess?.()
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Medication Name</Label>
                <Input id="name" {...register("name")} placeholder="e.g. Folic Acid" />
                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message as string}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input id="dosage" {...register("dosage")} placeholder="e.g. 400mcg" />
                {errors.dosage && (
                    <p className="text-sm text-destructive">{errors.dosage.message as string}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                        onValueChange={(value) => setValue("frequency", value as MedicationFrequency)}
                        defaultValue={frequency}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="TWICE_DAILY">Twice Daily</SelectItem>
                            <SelectItem value="THREE_TIMES_DAILY">3x Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="AS_NEEDED">As Needed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input type="date" id="startDate" {...register("startDate")} />
                </div>
            </div>

            {frequency !== "AS_NEEDED" && (
                <div className="space-y-2">
                    <Label>Reminder Times</Label>
                    <div className="space-y-2">
                        {times.map((time, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => updateTime(index, e.target.value)}
                                />
                                {times.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeTime(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addTime}
                            className="w-full"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Time
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Create Reminder"
                    )}
                </Button>
            </div>
        </form>
    )
}
