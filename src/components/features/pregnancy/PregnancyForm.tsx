"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreatePregnancyInput, createPregnancySchema } from "@/lib/validations/pregnancy.validation"
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
import { usePregnancy } from "@/hooks/usePregnancy"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Calendar } from "lucide-react"
import { useState } from "react"
import { addWeeks, format } from "date-fns"

interface PregnancyFormProps {
    onSuccess?: () => void
    onCancel?: () => void
}

export function PregnancyForm({ onSuccess, onCancel }: PregnancyFormProps) {
    const { createPregnancy } = usePregnancy()
    const { toast } = useToast()
    const [inputMode, setInputMode] = useState<"lmp" | "dueDate">("lmp")

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<CreatePregnancyInput>({
        resolver: zodResolver(createPregnancySchema),
    })

    const startDate = watch("startDate")
    const dueDate = watch("dueDate")

    // Auto-calculate due date from LMP (40 weeks)
    const handleLMPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const lmpDate = new Date(e.target.value)
        setValue("startDate", lmpDate)

        // Calculate due date (40 weeks from LMP)
        const calculatedDueDate = addWeeks(lmpDate, 40)
        setValue("dueDate", calculatedDueDate)
    }

    // Auto-calculate LMP from due date (subtract 40 weeks)
    const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dueDateValue = new Date(e.target.value)
        setValue("dueDate", dueDateValue)

        // Calculate LMP (40 weeks before due date)
        const calculatedLMP = addWeeks(dueDateValue, -40)
        setValue("startDate", calculatedLMP)
    }

    const onSubmit = async (data: CreatePregnancyInput) => {
        try {
            await createPregnancy(data)
            toast({
                title: "Success",
                description: "Pregnancy tracking started successfully",
            })
            onSuccess?.()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to start pregnancy tracking",
                variant: "destructive",
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant={inputMode === "lmp" ? "default" : "outline"}
                        onClick={() => setInputMode("lmp")}
                        className="flex-1"
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        Enter LMP Date
                    </Button>
                    <Button
                        type="button"
                        variant={inputMode === "dueDate" ? "default" : "outline"}
                        onClick={() => setInputMode("dueDate")}
                        className="flex-1"
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        Enter Due Date
                    </Button>
                </div>

                {inputMode === "lmp" ? (
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Last Menstrual Period (LMP) *</Label>
                        <Input
                            id="startDate"
                            type="date"
                            onChange={handleLMPChange}
                            max={format(new Date(), "yyyy-MM-dd")}
                        />
                        {errors.startDate && (
                            <p className="text-sm text-destructive">{errors.startDate.message}</p>
                        )}
                        {dueDate && (
                            <p className="text-sm text-muted-foreground">
                                Calculated due date: {format(new Date(dueDate), "PPP")}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Expected Due Date *</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            onChange={handleDueDateChange}
                            min={format(new Date(), "yyyy-MM-dd")}
                        />
                        {errors.dueDate && (
                            <p className="text-sm text-destructive">{errors.dueDate.message}</p>
                        )}
                        {startDate && (
                            <p className="text-sm text-muted-foreground">
                                Calculated LMP: {format(new Date(startDate), "PPP")}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type (Optional)</Label>
                    <Select onValueChange={(value) => setValue("bloodType", value as any)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="AB">AB</SelectItem>
                            <SelectItem value="O">O</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="rhFactor">Rh Factor (Optional)</Label>
                    <Select onValueChange={(value) => setValue("rhFactor", value as "Positive" | "Negative")}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Rh factor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Positive">Positive (+)</SelectItem>
                            <SelectItem value="Negative">Negative (-)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="height">Height (cm) (Optional)</Label>
                    <Input
                        id="height"
                        type="number"
                        step="0.1"
                        {...register("height", { valueAsNumber: true })}
                        placeholder="e.g., 165"
                    />
                    {errors.height && (
                        <p className="text-sm text-destructive">{errors.height.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="prePregnancyWeight">Pre-pregnancy Weight (kg) (Optional)</Label>
                    <Input
                        id="prePregnancyWeight"
                        type="number"
                        step="0.1"
                        {...register("prePregnancyWeight", { valueAsNumber: true })}
                        placeholder="e.g., 60"
                    />
                    {errors.prePregnancyWeight && (
                        <p className="text-sm text-destructive">{errors.prePregnancyWeight.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Starting...
                        </>
                    ) : (
                        "Start Pregnancy Tracking"
                    )}
                </Button>
            </div>
        </form>
    )
}
