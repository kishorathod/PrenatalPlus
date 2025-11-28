"use client"

import { VitalSign } from "@/types/vitals.types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { VitalType } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VitalsForm } from "./VitalsForm"

interface VitalsCardProps {
  vital: VitalSign
  onEdit?: (vital: VitalSign) => void
  onDelete?: (id: string) => void
}

const typeLabels: Record<VitalType, string> = {
  WEIGHT: "Weight",
  BLOOD_PRESSURE_SYSTOLIC: "Blood Pressure (Systolic)",
  BLOOD_PRESSURE_DIASTOLIC: "Blood Pressure (Diastolic)",
  HEART_RATE: "Heart Rate",
  TEMPERATURE: "Temperature",
  BLOOD_SUGAR: "Blood Sugar",
  SPO2: "SpO2",
  GLUCOSE: "Glucose",
  FETAL_MOVEMENT: "Fetal Movement",
  OTHER: "Other",
}

export function VitalsCard({ vital, onEdit, onDelete }: VitalsCardProps) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this vital sign?")) {
      onDelete?.(vital.id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{typeLabels[vital.type]}</CardTitle>
            <CardDescription className="mt-1">
              <span className="text-2xl font-bold">
                {vital.value} {vital.unit}
              </span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Vital Sign</DialogTitle>
                  <DialogDescription>
                    Update vital sign details
                  </DialogDescription>
                </DialogHeader>
                <VitalsForm
                  vital={vital}
                  onSuccess={() => onEdit?.(vital)}
                />
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(vital.recordedAt), "PPP 'at' p")}
          </div>
          {vital.week && (
            <div className="text-sm text-muted-foreground">
              Week {vital.week} of pregnancy
            </div>
          )}
          {vital.notes && (
            <p className="mt-3 text-sm">{vital.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


