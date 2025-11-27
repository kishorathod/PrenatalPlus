"use client"

import { useCallback } from "react"
import { useVitalsStore } from "@/store/useVitalsStore"
import { VitalSign } from "@/types/vitals.types"

export function useVitals() {
  const {
    vitals,
    isLoading,
    error,
    setVitals,
    setLoading,
    setError,
    addVital,
    updateVital,
    deleteVital,
    getVitalsByType,
    getLatestVital,
  } = useVitalsStore()

  const fetchVitals = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/vitals")
      if (!response.ok) {
        throw new Error("Failed to fetch vitals")
      }
      const data = await response.json()
      setVitals(data.vitals || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch vitals")
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setVitals])

  const createVital = useCallback(async (vitalData: Partial<VitalSign>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vitalData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create vital")
      }

      const newVital = await response.json()
      addVital(newVital)
      return newVital
    } catch (err: any) {
      setError(err.message || "Failed to create vital")
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, addVital])

  const updateVitalById = useCallback(async (id: string, vitalData: Partial<VitalSign>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/vitals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vitalData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update vital")
      }

      const updated = await response.json()
      updateVital(id, updated)
      return updated
    } catch (err: any) {
      setError(err.message || "Failed to update vital")
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, updateVital])

  const deleteVitalById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/vitals/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete vital")
      }

      deleteVital(id)
    } catch (err: any) {
      setError(err.message || "Failed to delete vital")
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, deleteVital])

  return {
    vitals,
    isLoading,
    error,
    fetchVitals,
    createVital,
    updateVital: updateVitalById,
    deleteVital: deleteVitalById,
    getVitalsByType,
    getLatestVital,
  }
}


