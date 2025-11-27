"use client"

import { useEffect } from "react"
import { useAppointments } from "@/hooks/useAppointments"
import { AppointmentCard } from "@/components/features/appointments/AppointmentCard"
import { Button } from "@/components/ui/button"
import { Plus, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AppointmentForm } from "@/components/features/appointments/AppointmentForm"
import { Loading } from "@/components/ui/loading"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AppointmentsPage() {
  const {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    deleteAppointment,
  } = useAppointments()

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id)
    } catch (error) {
      console.error("Failed to delete appointment:", error)
    }
  }

  if (isLoading) {
    return <Loading size="lg" text="Loading appointments..." />
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-2">
            Manage your medical appointments
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Appointment</DialogTitle>
              <DialogDescription>
                Schedule a new medical appointment
              </DialogDescription>
            </DialogHeader>
            <AppointmentForm
              onSuccess={() => {
                fetchAppointments()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No appointments</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first appointment
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Appointment</DialogTitle>
                <DialogDescription>
                  Schedule a new medical appointment
                </DialogDescription>
              </DialogHeader>
              <AppointmentForm
                onSuccess={() => {
                  fetchAppointments()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onEdit={() => fetchAppointments()}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}


