"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Edit, Trash2, Heart, Weight as WeightIcon, Activity } from "lucide-react"
import { format } from "date-fns"

interface VitalsCardProps {
  vital: any
  onEdit?: (vital: any) => void
  onDelete?: (id: string) => void
}

export function VitalsCard({ vital, onEdit, onDelete }: VitalsCardProps) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this vital reading?")) {
      onDelete?.(vital.id)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4">
              {/* Blood Pressure */}
              {(vital.systolic || vital.diastolic) && (
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Blood Pressure</p>
                    <p className="text-lg font-bold">
                      {vital.systolic}/{vital.diastolic}
                    </p>
                    <p className="text-xs text-gray-400">mmHg</p>
                  </div>
                </div>
              )}

              {/* Weight */}
              {vital.weight && (
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <WeightIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Weight</p>
                    <p className="text-lg font-bold">{vital.weight}</p>
                    <p className="text-xs text-gray-400">kg</p>
                  </div>
                </div>
              )}

              {/* Heart Rate */}
              {vital.heartRate && (
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Heart Rate</p>
                    <p className="text-lg font-bold">{vital.heartRate}</p>
                    <p className="text-xs text-gray-400">bpm</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit?.(vital)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground border-t pt-3">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(vital.recordedAt), "PPP 'at' p")}
          </div>
          {vital.week && (
            <div className="ml-6">
              Week {vital.week} of pregnancy
            </div>
          )}
          {vital.notes && (
            <p className="mt-2 ml-6">{vital.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

