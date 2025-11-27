"use client"

import { MedicalReport } from "@/types/report.types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"

interface ReportViewerProps {
  report: MedicalReport | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportViewer({ report, open, onOpenChange }: ReportViewerProps) {
  if (!report) return null

  const handleDownload = () => {
    window.open(report.fileUrl, "_blank")
  }

  const isPDF = report.mimeType === "application/pdf"
  const isImage = report.mimeType.startsWith("image/")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{report.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isPDF ? (
            <iframe
              src={report.fileUrl}
              className="w-full h-[600px] border rounded"
              title={report.title}
            />
          ) : isImage ? (
            <img
              src={report.fileUrl}
              alt={report.title}
              className="w-full h-auto rounded"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border rounded">
              <p className="text-muted-foreground mb-4">
                Preview not available for this file type
              </p>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download to View
              </Button>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleDownload}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


