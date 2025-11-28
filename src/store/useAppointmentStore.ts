import { create } from "zustand"
import { Appointment } from "@/types/appointment.types"
import { AppointmentType, AppointmentStatus } from "@prisma/client"

interface AppointmentState {
  appointments: Appointment[]
  selectedAppointment: Appointment | null
  isLoading: boolean
  error: string | null

  // Actions
  setAppointments: (appointments: Appointment[]) => void
  addAppointment: (appointment: Appointment) => void
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void
  setSelectedAppointment: (appointment: Appointment | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
  error: null,

  setAppointments: (appointments) => set({ appointments }),

  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [appointment, ...state.appointments],
    })),

  updateAppointment: (id, updatedData) =>
    set((state) => ({
      appointments: state.appointments.map((app) =>
        app.id === id ? { ...app, ...updatedData } : app
      ),
      selectedAppointment:
        state.selectedAppointment?.id === id
          ? { ...state.selectedAppointment, ...updatedData }
          : state.selectedAppointment,
    })),

  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((app) => app.id !== id),
      selectedAppointment:
        state.selectedAppointment?.id === id
          ? null
          : state.selectedAppointment,
    })),

  setSelectedAppointment: (appointment) =>
    set({ selectedAppointment: appointment }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}))


