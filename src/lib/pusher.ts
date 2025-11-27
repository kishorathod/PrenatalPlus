"use client"

import Pusher from "pusher-js"

let pusher: Pusher | null = null

if (typeof window !== "undefined") {
  pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
  })
}

export { pusher }


