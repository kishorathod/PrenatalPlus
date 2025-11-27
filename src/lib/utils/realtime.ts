import { pusherServer } from "@/lib/pusher-server"

export async function triggerAppointmentEvent(
  userId: string,
  event: "created" | "updated" | "deleted",
  data: any
) {
  try {
    await pusherServer.trigger(
      `user-${userId}`,
      `appointment.${event}`,
      data
    )
  } catch (error) {
    console.error("Error triggering appointment event:", error)
  }
}

export async function triggerVitalEvent(
  userId: string,
  event: "added" | "updated" | "deleted",
  data: any
) {
  try {
    await pusherServer.trigger(
      `user-${userId}`,
      `vital.${event}`,
      data
    )
  } catch (error) {
    console.error("Error triggering vital event:", error)
  }
}

export async function triggerNotificationEvent(
  userId: string,
  notification: any
) {
  try {
    await pusherServer.trigger(
      `user-${userId}`,
      "notification.new",
      notification
    )
  } catch (error) {
    console.error("Error triggering notification event:", error)
  }
}


