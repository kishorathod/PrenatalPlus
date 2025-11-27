"use client"

import { Appointment } from "@/types/appointment.types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { AppointmentType, AppointmentStatus } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AppointmentForm } from "./AppointmentForm"

interface AppointmentCardProps {
  appointment: Appointment
  onEdit?: (appointment: Appointment) => void
  onDelete?: (id: string) => void
}

const statusColors: Record<AppointmentStatus, string> = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
  RESCHEDULED: "bg-yellow-100 text-yellow-800",
}

const typeLabels: Record<AppointmentType, string> = {
  ROUTINE_CHECKUP: "Routine Checkup",
  ULTRASOUND: "Ultrasound",
  LAB_TEST: "Lab Test",
  CONSULTATION: "Consultation",
  EMERGENCY: "Emergency",
  OTHER: "Other",
}

export function AppointmentCard({ appointment, onEdit, onDelete }: AppointmentCardProps) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      onDelete?.(appointment.id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{appointment.title}</CardTitle>
            <CardDescription className="mt-1">
              <Badge className={statusColors[appointment.status]}>
                {appointment.status}
              </Badge>
              <span className="ml-2">{typeLabels[appointment.type]}</span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Appointment</DialogTitle>
                  <DialogDescription>
                    Update appointment details
                  </DialogDescription>
                </DialogHeader>
                <AppointmentForm
                  appointment={appointment}
                  onSuccess={() => onEdit?.(appointment)}
                />
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(appointment.date), "PPP 'at' p")}
          </div>
          {appointment.duration && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              {appointment.duration} minutes
            </div>
          )}
          {appointment.doctorName && (
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              {appointment.doctorName}
            </div>
          )}
          {appointment.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              {appointment.location}
            </div>
          )}
          {appointment.description && (
            <p className="mt-3 text-sm">{appointment.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


