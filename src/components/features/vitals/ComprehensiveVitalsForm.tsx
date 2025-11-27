"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createVitalReadingSchema } from "@/lib/validations/vital-reading.validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Heart, Activity, Weight, Thermometer, Droplet, Wind, Baby } from "lucide-react"
import { z } from "zod"

type FormData = z.infer<typeof createVitalReadingSchema>

interface ComprehensiveVitalsFormProps {
    onSuccess?: (reading: any) => void
    pregnancyId?: string
}

export function ComprehensiveVitalsForm({ onSuccess, pregnancyId }: ComprehensiveVitalsFormProps) {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(createVitalReadingSchema),
        defaultValues: {
            pregnancyId,
        },
    })

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/vitals/readings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Failed to save vital reading")
            }

            const reading = await response.json()

            toast({
                title: "Success",
                description: reading.hasAlerts
                    ? `Vital reading saved with ${reading.alerts.length} alert(s)`
                    : "Vital reading saved successfully",
                variant: reading.hasAlerts ? "destructive" : "default",
            })

            reset()
            onSuccess?.(reading)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Blood Pressure */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm rounded-xl">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-pink-50">
                            <Heart className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold text-gray-800">Blood Pressure</CardTitle>
                            <CardDescription className="text-sm text-gray-500">Systolic / Diastolic</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="systolic" className="text-gray-700">Systolic</Label>
                            <div className="relative">
                                <Input
                                    id="systolic"
                                    type="number"
                                    {...register("systolic", { valueAsNumber: true })}
                                    placeholder="120"
                                    className="rounded-xl"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">mmHg</span>
                            </div>
                            {errors.systolic && (
                                <p className="text-sm text-destructive">{errors.systolic.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="diastolic" className="text-gray-700">Diastolic</Label>
                            <div className="relative">
                                <Input
                                    id="diastolic"
                                    type="number"
                                    {...register("diastolic", { valueAsNumber: true })}
                                    placeholder="80"
                                    className="rounded-xl"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">mmHg</span>
                            </div>
                            {errors.diastolic && (
                                <p className="text-sm text-destructive">{errors.diastolic.message}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Heart Rate & Weight */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm rounded-xl">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-blue-50">
                                <Activity className="h-5 w-5 text-blue-600" />
                            </div>
                            <CardTitle className="text-base font-semibold text-gray-800">Heart Rate</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    id="heartRate"
                                    type="number"
                                    {...register("heartRate", { valueAsNumber: true })}
                                    placeholder="72"
                                    className="rounded-xl"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">bpm</span>
                            </div>
                            {errors.heartRate && (
                                <p className="text-sm text-destructive">{errors.heartRate.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm rounded-xl">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-purple-50">
                                <Weight className="h-5 w-5 text-purple-600" />
                            </div>
                            <CardTitle className="text-base font-semibold text-gray-800">Weight</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    {...register("weight", { valueAsNumber: true })}
                                    placeholder="65.5"
                                    className="rounded-xl"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">kg</span>
                            </div>
                            {errors.weight && (
                                <p className="text-sm text-destructive">{errors.weight.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Optional Measurements */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm rounded-xl">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-gray-800">Optional Measurements</CardTitle>
                    <CardDescription className="text-sm text-gray-500">Add any additional vitals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Temperature */}
                        <div className="space-y-2">
                            <Label htmlFor="temperature" className="text-gray-700 flex items-center gap-2">
                                <Thermometer className="h-4 w-4" />
                                Temperature
                            </Label>
                            <div className="relative">
                                <Input
                                    id="temperature"
                                    type="number"
                                    step="0.1"
                                    {...register("temperature", { valueAsNumber: true })}
                                    placeholder="36.5"
                                    className="rounded-xl"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">°C</span>
                            </div>
                            {errors.temperature && (
                                <p className="text-sm text-destructive">{errors.temperature.message}</p>
                            )}
                        </div>

                        {/* Glucose */}
                        <div className="space-y-2">
                            <Label htmlFor="glucose" className="text-gray-700 flex items-center gap-2">
                                <Droplet className="h-4 w-4" />
                                Blood Glucose
                            </Label>
                            <div className="relative">
                                <Input
                                    id="glucose"
                                    type="number"
                                    step="0.1"
                                    {...register("glucose", { valueAsNumber: true })}
                                    placeholder="95"
                                    className="rounded-xl"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">mg/dL</span>
                            </div>
                            {errors.glucose && (
                                <p className="text-sm text-destructive">{errors.glucose.message}</p>
                            )}
                        </div>

                        {/* SpO2 */}
                        <div className="space-y-2">
                            <Label htmlFor="spo2" className="text-gray-700 flex items-center gap-2">
                                <Wind className="h-4 w-4" />
                                Oxygen Saturation (SpO2)
                            </Label>
                            <div className="relative">
                                <Input
                                    id="spo2"
                                    type="number"
                                    {...register("spo2", { valueAsNumber: true })}
                                    placeholder="98"
                                    className="rounded-xl"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">%</span>
                            </div>
                            {errors.spo2 && (
                                <p className="text-sm text-destructive">{errors.spo2.message}</p>
                            )}
                        </div>

                        {/* Fetal Movement */}
                        <div className="space-y-2">
                            <Label htmlFor="fetalMovement" className="text-gray-700 flex items-center gap-2">
                                <Baby className="h-4 w-4" />
                                Fetal Movement
                            </Label>
                            <div className="relative">
                                <Input
                                    id="fetalMovement"
                                    type="number"
                                    {...register("fetalMovement", { valueAsNumber: true })}
                                    placeholder="10"
                                    className="rounded-xl"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">per hour</span>
                            </div>
                            {errors.fetalMovement && (
                                <p className="text-sm text-destructive">{errors.fetalMovement.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Week & Notes */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="week" className="text-gray-700">Week of Pregnancy</Label>
                            <Input
                                id="week"
                                type="number"
                                {...register("week", { valueAsNumber: true })}
                                placeholder="28"
                                className="rounded-xl"
                            />
                            {errors.week && (
                                <p className="text-sm text-destructive">{errors.week.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-gray-700">Notes</Label>
                        <Textarea
                            id="notes"
                            {...register("notes")}
                            placeholder="Any additional observations..."
                            rows={3}
                            className="rounded-xl"
                        />
                        {errors.notes && (
                            <p className="text-sm text-destructive">{errors.notes.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl shadow-sm"
                    size="lg"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Vital Reading"
                    )}
                </Button>
            </div>

            {errors.root && (
                <p className="text-sm text-destructive text-center">{errors.root.message}</p>
            )}
        </form>
    )
}
