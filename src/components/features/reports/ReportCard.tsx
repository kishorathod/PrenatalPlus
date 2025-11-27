"use client"

import { MedicalReport } from "@/types/report.types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, User, Building, Trash2, Download } from "lucide-react"
import { format } from "date-fns"
import { ReportType } from "@prisma/client"

interface ReportCardProps {
  report: MedicalReport
  onDelete?: (id: string) => void
  onView?: (report: MedicalReport) => void
}

const typeLabels: Record<ReportType, string> = {
  ULTRASOUND: "Ultrasound",
  LAB_RESULT: "Lab Result",
  BLOOD_TEST: "Blood Test",
  URINE_TEST: "Urine Test",
  PRESCRIPTION: "Prescription",
  DOCTOR_NOTES: "Doctor Notes",
  OTHER: "Other",
}

export function ReportCard({ report, onDelete, onView }: ReportCardProps) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this report?")) {
      onDelete?.(report.id)
    }
  }

  const handleDownload = () => {
    window.open(report.fileUrl, "_blank")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{report.title}</CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="secondary">{typeLabels[report.type]}</Badge>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {report.reportDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {format(new Date(report.reportDate), "PPP")}
            </div>
          )}
          {report.doctorName && (
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              {report.doctorName}
            </div>
          )}
          {report.clinicName && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Building className="mr-2 h-4 w-4" />
              {report.clinicName}
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="mr-2 h-4 w-4" />
            {report.fileName} ({formatFileSize(report.fileSize)})
          </div>
          {report.description && (
            <p className="mt-3 text-sm">{report.description}</p>
          )}
          {onView && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => onView(report)}
            >
              View Report
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


