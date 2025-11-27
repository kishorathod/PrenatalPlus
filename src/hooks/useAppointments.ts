"use client"

import { useCallback } from "react"
import { useAppointmentStore } from "@/store/useAppointmentStore"
import { Appointment } from "@/types/appointment.types"

export function useAppointments() {
  const {
    appointments,
    isLoading,
    error,
    setAppointments,
    setLoading,
    setError,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useAppointmentStore()

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/appointments")
      if (!response.ok) {
        throw new Error("Failed to fetch appointments")
      }
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch appointments")
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setAppointments])

  const createAppointment = useCallback(async (appointmentData: Partial<Appointment>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create appointment")
      }

      const newAppointment = await response.json()
      addAppointment(newAppointment)
      return newAppointment
    } catch (err: any) {
      setError(err.message || "Failed to create appointment")
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, addAppointment])

  const updateAppointmentById = useCallback(async (
    id: string,
    appointmentData: Partial<Appointment>
  ) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update appointment")
      }

      const updated = await response.json()
      updateAppointment(id, updated)
      return updated
    } catch (err: any) {
      setError(err.message || "Failed to update appointment")
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, updateAppointment])

  const deleteAppointmentById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete appointment")
      }

      deleteAppointment(id)
    } catch (err: any) {
      setError(err.message || "Failed to delete appointment")
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, deleteAppointment])

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment: updateAppointmentById,
    deleteAppointment: deleteAppointmentById,
  }
}


