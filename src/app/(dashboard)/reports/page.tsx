"use client"

import { useState, useEffect } from "react"
import { ReportCard } from "@/components/features/reports/ReportCard"
import { ReportViewer } from "@/components/features/reports/ReportViewer"
import { Button } from "@/components/ui/button"
import { Plus, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReportUpload } from "@/components/features/reports/ReportUpload"
import { Loading } from "@/components/ui/loading"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MedicalReport } from "@/types/report.types"

export default function ReportsPage() {
  const [reports, setReports] = useState<MedicalReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewingReport, setViewingReport] = useState<MedicalReport | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const fetchReports = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/reports")
      if (!response.ok) {
        throw new Error("Failed to fetch reports")
      }
      const data = await response.json()
      setReports(data.reports || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch reports")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete report")
      }
      fetchReports()
    } catch (error) {
      console.error("Failed to delete report:", error)
    }
  }

  const handleUploadSuccess = () => {
    fetchReports()
    setIsUploadOpen(false)
  }

  if (isLoading) {
    return <Loading size="lg" text="Loading reports..." />
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medical Reports</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your medical reports
          </p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Medical Report</DialogTitle>
              <DialogDescription>
                Upload a new medical report or document
              </DialogDescription>
            </DialogHeader>
            <ReportUpload
              onSuccess={handleUploadSuccess}
              onCancel={() => setIsUploadOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No reports</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first medical report
          </p>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Report
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onDelete={handleDelete}
              onView={setViewingReport}
            />
          ))}
        </div>
      )}

      <ReportViewer
        report={viewingReport}
        open={!!viewingReport}
        onOpenChange={(open) => !open && setViewingReport(null)}
      />
    </div>
  )
}

