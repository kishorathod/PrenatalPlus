"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createReportSchema, reportFormSchema, ReportFormInput } from "@/lib/validations/report.validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ReportType } from "@prisma/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"
import { UploadButton } from "@/lib/uploadthing"

interface ReportUploadProps {
  onSuccess?: () => void
  onCancel?: () => void
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

export function ReportUpload({ onSuccess, onCancel }: ReportUploadProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{
    url: string
    name: string
    size: number
    type: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ReportFormInput>({
    resolver: zodResolver(reportFormSchema),
  })

  const onSubmit = async (data: ReportFormInput) => {
    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload a file first",
        variant: "destructive",
      })
      return
    }

    console.log("Submitting report:", data)
    setIsUploading(true)
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          fileUrl: uploadedFile.url,
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
          mimeType: uploadedFile.type,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create report")
      }

      toast({
        title: "Success",
        description: "Report uploaded successfully",
      })
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload report",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>File *</Label>
        <UploadButton
          endpoint="reportUploader"
          onClientUploadComplete={(res) => {
            if (res && res[0]) {
              setUploadedFile({
                url: res[0].url,
                name: res[0].name,
                size: res[0].size,
                type: res[0].type || "application/pdf",
              })
              toast({
                title: "Success",
                description: "File uploaded successfully",
              })
            }
          }}
          onUploadError={(error: Error) => {
            toast({
              title: "Upload Error",
              description: error.message,
              variant: "destructive",
            })
          }}
        />
        {uploadedFile && (
          <p className="text-sm text-muted-foreground">
            Uploaded: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="e.g., 12 Week Ultrasound"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type *</Label>
        <Select
          value={watch("type")}
          onValueChange={(value) => setValue("type", value as ReportType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(typeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reportDate">Report Date</Label>
        <Input
          id="reportDate"
          type="date"
          {...register("reportDate")}
        />
        {errors.reportDate && (
          <p className="text-sm text-destructive">{errors.reportDate.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="doctorName">Doctor Name</Label>
          <Input
            id="doctorName"
            {...register("doctorName")}
            placeholder="Dr. Smith"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clinicName">Clinic Name</Label>
          <Input
            id="clinicName"
            {...register("clinicName")}
            placeholder="Hospital name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Additional notes..."
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || isUploading || !uploadedFile}>
          {(isSubmitting || isUploading) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
