"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Appointment, CreateAppointmentInput } from "@/types/appointment.types"
import { createAppointmentSchema } from "@/lib/validations/appointment.validation"
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
import { AppointmentType } from "@prisma/client"
import { useAppointments } from "@/hooks/useAppointments"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { getAvailableDoctors } from "@/server/actions/doctors"
import { useEffect, useState } from "react"

interface AppointmentFormProps {
  appointment?: Appointment
  onSuccess?: () => void
  onCancel?: () => void
}

export function AppointmentForm({ appointment, onSuccess, onCancel }: AppointmentFormProps) {
  const { createAppointment, updateAppointment } = useAppointments()
  const { toast } = useToast()
  const isEditing = !!appointment

  const [doctors, setDoctors] = useState<{ id: string; name: string | null; specialization: string | null }[]>([])
  const [isCustomDoctor, setIsCustomDoctor] = useState(false)

  useEffect(() => {
    const loadDoctors = async () => {
      const result = await getAvailableDoctors()
      if (result.doctors) {
        setDoctors(result.doctors)
      }
    }
    loadDoctors()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateAppointmentInput>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: appointment
      ? {
        title: appointment.title,
        description: appointment.description || undefined,
        type: appointment.type,
        doctorName: appointment.doctorName || undefined,
        location: appointment.location || undefined,
        date: new Date(appointment.date),
        duration: appointment.duration,
      }
      : {
        duration: 30,
      },
  })

  const onSubmit = async (data: CreateAppointmentInput) => {
    try {
      if (isEditing && appointment) {
        await updateAppointment(appointment.id, data)
        toast({
          title: "Success",
          description: "Appointment updated successfully",
        })
      } else {
        await createAppointment(data)
        toast({
          title: "Success",
          description: "Appointment created successfully",
        })
      }
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save appointment",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="e.g., Routine Checkup"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type *</Label>
        <Select
          value={watch("type")}
          onValueChange={(value) => setValue("type", value as AppointmentType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select appointment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ROUTINE_CHECKUP">Routine Checkup</SelectItem>
            <SelectItem value="ULTRASOUND">Ultrasound</SelectItem>
            <SelectItem value="LAB_TEST">Lab Test</SelectItem>
            <SelectItem value="CONSULTATION">Consultation</SelectItem>
            <SelectItem value="EMERGENCY">Emergency</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date & Time *</Label>
        <Input
          id="date"
          type="datetime-local"
          {...register("date")}
        />
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          {...register("duration", { valueAsNumber: true })}
        />
        {errors.duration && (
          <p className="text-sm text-destructive">{errors.duration.message}</p>
        )}
      </div>




      <div className="space-y-2">
        <Label htmlFor="doctor">Doctor</Label>
        <Select
          value={isCustomDoctor ? "other" : (watch("doctorId") || "")}
          onValueChange={(value) => {
            if (value === "other") {
              setIsCustomDoctor(true)
              setValue("doctorId", undefined)
              setValue("doctorName", "")
            } else {
              setIsCustomDoctor(false)
              setValue("doctorId", value)
              const selectedDoctor = doctors.find(d => d.id === value)
              if (selectedDoctor) {
                setValue("doctorName", selectedDoctor.name || "")
              }
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </SelectItem>
            ))}
            <SelectItem value="other">Other / External Doctor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isCustomDoctor && (
        <div className="space-y-2">
          <Label htmlFor="doctorName">Doctor Name</Label>
          <Input
            id="doctorName"
            {...register("doctorName")}
            placeholder="Enter doctor's name"
          />
          {errors.doctorName && (
            <p className="text-sm text-destructive">{errors.doctorName.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register("location")}
          placeholder="e.g., Room 302, Main Building"
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Additional notes..."
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
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
            isEditing ? "Update" : "Create"
          )}
        </Button>
      </div>
    </form>
  )
}


