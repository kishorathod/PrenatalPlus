"use client"

import { useCallback, useEffect, useState } from "react"

type DashboardStatsResponse = {
  stats: {
    totalAppointments: number
    upcomingAppointments: number
    totalVitals: number
    totalReports: number
    activePregnancies: number
  }
  recent: {
    appointments: Array<{
      id: string
      title: string
      date: string
      status: string
    }>
    vitals: Array<{
      id: string
      type: string
      value: number
      unit: string
      recordedAt: string
    }>
  }
}

export function useDashboard() {
  const [data, setData] = useState<DashboardStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/dashboard/stats")
      if (!response.ok) {
        throw new Error("Failed to load dashboard data")
      }

      const payload = (await response.json()) as DashboardStatsResponse
      setData(payload)
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data")
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats: data,
    isLoading,
    error,
    refresh: fetchStats,
  }
}





