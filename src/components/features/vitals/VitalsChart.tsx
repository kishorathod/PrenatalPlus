"use client"

import { VitalSign, VitalType } from "@/types/vitals.types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface VitalsChartProps {
  vitals: VitalSign[]
  type: VitalType
  title?: string
}

export function VitalsChart({ vitals, type, title }: VitalsChartProps) {
  const filteredVitals = vitals
    .filter((v) => v.type === type)
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())

  if (filteredVitals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || "Vital Sign Chart"}</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const maxValue = Math.max(...filteredVitals.map((v) => v.value))
  const minValue = Math.min(...filteredVitals.map((v) => v.value))
  const range = maxValue - minValue || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || "Vital Sign Chart"}</CardTitle>
        <CardDescription>
          {filteredVitals.length} measurements recorded
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-end justify-between h-64 gap-1">
            {filteredVitals.map((vital, index) => {
              const height = ((vital.value - minValue) / range) * 100
              return (
                <div
                  key={vital.id}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div
                    className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${vital.value} ${vital.unit} - ${format(new Date(vital.recordedAt), "MMM d")}`}
                  />
                  {index % Math.ceil(filteredVitals.length / 5) === 0 && (
                    <span className="text-xs text-muted-foreground mt-1 transform -rotate-45 origin-top-left">
                      {format(new Date(vital.recordedAt), "MMM d")}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Min: {minValue.toFixed(1)}</span>
            <span>Max: {maxValue.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


