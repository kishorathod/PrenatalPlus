import { ReportType } from '@prisma/client'

export interface MedicalReport {
  id: string
  userId: string
  pregnancyId: string | null
  title: string
  type: ReportType
  description: string | null
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  reportDate: Date | null
  doctorName: string | null
  clinicName: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateReportData {
  title: string
  type: ReportType
  description?: string
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  reportDate?: Date
  doctorName?: string
  clinicName?: string
  pregnancyId?: string
}


