"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { VitalSign, CreateVitalInput } from "@/types/vitals.types"
import { createVitalSchema } from "@/lib/validations/vitals.validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VitalType } from "@prisma/client"
import { useVitals } from "@/hooks/useVitals"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface VitalsFormProps {
  vital?: VitalSign
  onSuccess?: () => void
  onCancel?: () => void
}

const typeLabels: Record<VitalType, string> = {
  WEIGHT: "Weight",
  BLOOD_PRESSURE_SYSTOLIC: "Blood Pressure (Systolic)",
  BLOOD_PRESSURE_DIASTOLIC: "Blood Pressure (Diastolic)",
  HEART_RATE: "Heart Rate",
  TEMPERATURE: "Temperature",
  BLOOD_SUGAR: "Blood Sugar",
  OTHER: "Other",
}

const defaultUnits: Record<VitalType, string> = {
  WEIGHT: "kg",
  BLOOD_PRESSURE_SYSTOLIC: "mmHg",
  BLOOD_PRESSURE_DIASTOLIC: "mmHg",
  HEART_RATE: "bpm",
  TEMPERATURE: "°C",
  BLOOD_SUGAR: "mg/dL",
  OTHER: "",
}

export function VitalsForm({ vital, onSuccess, onCancel }: VitalsFormProps) {
  const { createVital, updateVital } = useVitals()
  const { toast } = useToast()
  const isEditing = !!vital

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateVitalInput>({
    resolver: zodResolver(createVitalSchema),
    defaultValues: vital
      ? {
          type: vital.type,
          value: vital.value,
          unit: vital.unit,
          week: vital.week || undefined,
          notes: vital.notes || undefined,
          recordedAt: new Date(vital.recordedAt),
        }
      : {},
  })

  const selectedType = watch("type")
  const defaultUnit = selectedType ? defaultUnits[selectedType] : ""

  const onSubmit = async (data: CreateVitalInput) => {
    try {
      // Set default unit if not provided
      if (!data.unit && selectedType) {
        data.unit = defaultUnits[selectedType]
      }

      if (isEditing && vital) {
        await updateVital(vital.id, data)
        toast({
          title: "Success",
          description: "Vital sign updated successfully",
        })
      } else {
        await createVital(data)
        toast({
          title: "Success",
          description: "Vital sign recorded successfully",
        })
      }
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save vital sign",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type *</Label>
        <Select
          value={watch("type")}
          onValueChange={(value) => {
            setValue("type", value as VitalType)
            if (!watch("unit")) {
              setValue("unit", defaultUnits[value as VitalType])
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select vital type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(typeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">Value *</Label>
          <Input
            id="value"
            type="number"
            step="0.1"
            {...register("value", { valueAsNumber: true })}
            placeholder="0.0"
          />
          {errors.value && (
            <p className="text-sm text-destructive">{errors.value.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit *</Label>
          <Input
            id="unit"
            {...register("unit")}
            placeholder={defaultUnit || "unit"}
          />
          {errors.unit && (
            <p className="text-sm text-destructive">{errors.unit.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="week">Week of Pregnancy</Label>
        <Input
          id="week"
          type="number"
          {...register("week", { valueAsNumber: true })}
          placeholder="Optional"
        />
        {errors.week && (
          <p className="text-sm text-destructive">{errors.week.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="recordedAt">Date & Time</Label>
        <Input
          id="recordedAt"
          type="datetime-local"
          {...register("recordedAt")}
        />
        {errors.recordedAt && (
          <p className="text-sm text-destructive">{errors.recordedAt.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Additional notes..."
          rows={3}
        />
        {errors.notes && (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        )}
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
              Saving...
            </>
          ) : (
            isEditing ? "Update" : "Record"
          )}
        </Button>
      </div>
    </form>
  )
}


