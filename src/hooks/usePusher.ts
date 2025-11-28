"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { pusher } from "@/lib/pusher"
import { useAppointmentStore } from "@/store/useAppointmentStore"
import { useVitalsStore } from "@/store/useVitalsStore"
import { useNotificationStore } from "@/store/useNotificationStore"
import { Appointment } from "@/types/appointment.types"
import { VitalSign } from "@/types/vitals.types"
import { Notification } from "@/types/notification.types"

export function usePusher() {
  const { data: session } = useSession()
  const { addAppointment, updateAppointment, deleteAppointment } = useAppointmentStore()
  const { addVital, updateVital, deleteVital } = useVitalsStore()
  const { addNotification } = useNotificationStore()

  useEffect(() => {
    if (!session?.user || !pusher) return

    const channel = pusher.subscribe(`user-${session.user.id}`)

    // Appointment events
    channel.bind("appointment.created", (data: Appointment) => {
      addAppointment(data)
    })

    channel.bind("appointment.updated", (data: Appointment) => {
      updateAppointment(data.id, data)
    })

    channel.bind("appointment.deleted", (data: { id: string }) => {
      deleteAppointment(data.id)
    })

    // Vitals events
    channel.bind("vital.added", (data: VitalSign) => {
      addVital(data)
    })

    channel.bind("vital.updated", (data: VitalSign) => {
      updateVital(data.id, data)
    })

    channel.bind("vital.deleted", (data: { id: string }) => {
      deleteVital(data.id)
    })

    // Notification events
    channel.bind("notification.new", (data: Notification) => {
      addNotification(data)
    })

    return () => {
      pusher?.unsubscribe(`user-${session.user.id}`)
    }
  }, [session, addAppointment, updateAppointment, deleteAppointment, addVital, updateVital, deleteVital, addNotification])

  return {}
}


