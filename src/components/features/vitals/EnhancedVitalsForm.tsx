import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateVitalData } from "@/types/vitals.types"
import { createVitalSchema } from "@/lib/validations/vitals.validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useVitals } from "@/hooks/useVitals"

interface EnhancedVitalsFormProps {
    onSuccess?: () => void
    onCancel?: () => void
}

const BP_PRESETS = [
    { label: "Normal", systolic: 120, diastolic: 80 },
    { label: "Elevated", systolic: 125, diastolic: 82 },
    { label: "High", systolic: 140, diastolic: 90 },
]

const WEIGHT_PRESETS = [
    { label: "+0.5kg", value: 0.5 },
    { label: "+1kg", value: 1.0 },
    { label: "-0.5kg", value: -0.5 },
]

const HEART_RATE_PRESETS = [
    { label: "Resting", value: 72 },
    { label: "Active", value: 95 },
]

export function EnhancedVitalsForm({ onSuccess, onCancel }: EnhancedVitalsFormProps) {
    const { toast } = useToast()
    const { createVital, isLoading } = useVitals()
    // Mock data for pregnancy week and last weight - in real app, fetch from context/DB
    const pregnancyWeek = 24
    const lastWeight = 65.5

    // Mock insight logic
    const [insight, setInsight] = useState<{ type: 'info' | 'error', message: string } | null>(null)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        defaultValues: {
            bpSystolic: 120,
            bpDiastolic: 80,
            heartRate: 75,
            weight: lastWeight,
            date: new Date(),
        }
    })

    const onSubmit = async (data: any) => {
        try {
            // Send data directly with correct field names
            const vitalData = {
                systolic: data.bpSystolic,
                diastolic: data.bpDiastolic,
                heartRate: data.heartRate,
                weight: data.weight,
                week: pregnancyWeek
            }

            await createVital(vitalData)
            toast({ title: "Vitals Recorded", description: "Successfully saved your vitals." })
            onSuccess?.()
        } catch (error: any) {
            console.error("Vitals error:", error)
            toast({ title: "Error", description: error.message || "Failed to save vitals.", variant: "destructive" })
        }
    }

    // Monitor values for insights
    const bpSystolic = watch("bpSystolic")
    const bpDiastolic = watch("bpDiastolic")

    useEffect(() => {
        if (bpSystolic > 140 || bpDiastolic > 90) {
            setInsight({ type: 'error', message: 'Your blood pressure is high. Please consult your doctor.' })
        } else if (bpSystolic < 90 || bpDiastolic < 60) {
            setInsight({ type: 'error', message: 'Your blood pressure is low. Stay hydrated.' })
        } else {
            setInsight(null)
        }
    }, [bpSystolic, bpDiastolic])


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-900">
                    <strong>Week {pregnancyWeek || "..."}</strong> of pregnancy
                </p>
            </div>

            {/* Blood Pressure */}
            <div className="space-y-3">
                <Label>Blood Pressure</Label>
                <div className="flex gap-2 flex-wrap">
                    {BP_PRESETS.map((preset) => (
                        <Button
                            key={preset.label}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setValue("bpSystolic", preset.systolic)
                                setValue("bpDiastolic", preset.diastolic)
                            }}
                        >
                            <Zap className="h-3 w-3 mr-1" />
                            {preset.label} ({preset.systolic}/{preset.diastolic})
                        </Button>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Input
                            type="number"
                            placeholder="Systolic"
                            {...register("bpSystolic", { valueAsNumber: true })}
                        />
                        <p className="text-xs text-gray-500 mt-1">Systolic (mmHg)</p>
                    </div>
                    <div>
                        <Input
                            type="number"
                            placeholder="Diastolic"
                            {...register("bpDiastolic", { valueAsNumber: true })}
                        />
                        <p className="text-xs text-gray-500 mt-1">Diastolic (mmHg)</p>
                    </div>
                </div>
            </div>

            {/* Weight */}
            <div className="space-y-3">
                <Label>Weight (kg)</Label>
                {lastWeight && (
                    <div className="flex gap-2 flex-wrap">
                        {WEIGHT_PRESETS.map((preset) => (
                            <Button
                                key={preset.label}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setValue("weight", lastWeight + preset.value)}
                            >
                                <Zap className="h-3 w-3 mr-1" />
                                {preset.label}
                            </Button>
                        ))}
                    </div>
                )}
                <Input
                    type="number"
                    step="0.1"
                    placeholder={lastWeight ? `Last: ${lastWeight} kg` : "Enter weight"}
                    {...register("weight", { valueAsNumber: true })}
                />
            </div>

            {/* Heart Rate */}
            <div className="space-y-3">
                <Label>Heart Rate (bpm)</Label>
                <div className="flex gap-2 flex-wrap">
                    {HEART_RATE_PRESETS.map((preset) => (
                        <Button
                            key={preset.label}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setValue("heartRate", preset.value)}
                        >
                            <Zap className="h-3 w-3 mr-1" />
                            {preset.label} ({preset.value})
                        </Button>
                    ))}
                </div>
                <Input
                    type="number"
                    placeholder="Enter heart rate"
                    {...register("heartRate", { valueAsNumber: true })}
                />
            </div>

            {/* Smart Insight */}
            {insight && (
                <Alert variant={insight.type === "error" ? "destructive" : "default"}>
                    <AlertDescription>{insight.message}</AlertDescription>
                </Alert>
            )}

            {/* Submit */}
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
                            Saving...
                        </>
                    ) : (
                        "Record Vitals"
                    )}
                </Button>
            </div>
        </form>
    )
}
