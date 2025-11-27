"use client"

import { useCallback, useEffect, useState } from "react"
import { Pregnancy, CreatePregnancyData, UpdatePregnancyData, PregnancyWithCounts } from "@/types/pregnancy.types"

export function usePregnancy() {
    const [pregnancies, setPregnancies] = useState<PregnancyWithCounts[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPregnancies = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/pregnancies")
            if (!response.ok) {
                throw new Error("Failed to fetch pregnancies")
            }

            const data = await response.json()
            setPregnancies(data.pregnancies || [])
        } catch (err: any) {
            setError(err.message || "Failed to fetch pregnancies")
            setPregnancies([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    const createPregnancy = useCallback(async (data: CreatePregnancyData) => {
        const response = await fetch("/api/pregnancies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to create pregnancy")
        }

        const pregnancy = await response.json()
        await fetchPregnancies()
        return pregnancy
    }, [fetchPregnancies])

    const updatePregnancy = useCallback(async (id: string, data: UpdatePregnancyData) => {
        const response = await fetch(`/api/pregnancies/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to update pregnancy")
        }

        const pregnancy = await response.json()
        await fetchPregnancies()
        return pregnancy
    }, [fetchPregnancies])

    const deletePregnancy = useCallback(async (id: string) => {
        const response = await fetch(`/api/pregnancies/${id}`, {
            method: "DELETE",
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to delete pregnancy")
        }

        await fetchPregnancies()
    }, [fetchPregnancies])

    useEffect(() => {
        fetchPregnancies()
    }, [fetchPregnancies])

    const activePregnancy = pregnancies.find(p => p.status === "ACTIVE")

    return {
        pregnancies,
        activePregnancy,
        isLoading,
        error,
        createPregnancy,
        updatePregnancy,
        deletePregnancy,
        refresh: fetchPregnancies,
    }
}
