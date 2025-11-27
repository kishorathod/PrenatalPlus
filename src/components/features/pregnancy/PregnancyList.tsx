"use client"

import { PregnancyWithCounts } from "@/types/pregnancy.types"
import { PregnancyCard } from "./PregnancyCard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Baby } from "lucide-react"

interface PregnancyListProps {
    pregnancies: PregnancyWithCounts[]
    onEdit?: (id: string) => void
}

export function PregnancyList({ pregnancies, onEdit }: PregnancyListProps) {
    if (pregnancies.length === 0) {
        return (
            <Alert>
                <Baby className="h-4 w-4" />
                <AlertDescription>
                    No pregnancy records found. Start tracking your pregnancy journey by creating a new record.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pregnancies.map((pregnancy) => (
                <PregnancyCard
                    key={pregnancy.id}
                    pregnancy={pregnancy}
                    onEdit={onEdit ? () => onEdit(pregnancy.id) : undefined}
                />
            ))}
        </div>
    )
}
