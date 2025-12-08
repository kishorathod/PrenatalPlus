"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Trash2, Calendar, User } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface ReportCardProps {
    report: {
        id: string
        title: string
        type: string
        fileName: string
        fileUrl: string
        fileSize: number
        reportDate: Date | string | null
        doctorName?: string | null
        clinicName?: string | null
        createdAt: Date | string
    }
    onDelete?: (id: string) => void
    showActions?: boolean
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function getReportTypeColor(type: string) {
    const colors: Record<string, string> = {
        ULTRASOUND: "bg-blue-100 text-blue-700",
        BLOOD_TEST: "bg-red-100 text-red-700",
        LAB_RESULT: "bg-purple-100 text-purple-700",
        URINE_TEST: "bg-yellow-100 text-yellow-700",
        PRESCRIPTION: "bg-green-100 text-green-700",
        OTHER: "bg-gray-100 text-gray-700"
    }
    return colors[type] || colors.OTHER
}

export function ReportCard({ report, onDelete, showActions = true }: ReportCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="p-3 bg-pink-50 rounded-lg">
                        <FileText className="h-6 w-6 text-pink-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 truncate">
                                    {report.title}
                                </h3>
                                <p className="text-sm text-gray-500 truncate mt-1">
                                    {report.fileName}
                                </p>
                            </div>
                            <Badge className={getReportTypeColor(report.type)}>
                                {report.type.replace(/_/g, " ")}
                            </Badge>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                            {report.reportDate && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{format(new Date(report.reportDate), "MMM d, yyyy")}</span>
                                </div>
                            )}
                            {report.doctorName && (
                                <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>Dr. {report.doctorName}</span>
                                </div>
                            )}
                            <span>{formatFileSize(report.fileSize)}</span>
                        </div>

                        {report.clinicName && (
                            <p className="text-xs text-gray-400 mt-1">
                                {report.clinicName}
                            </p>
                        )}

                        {/* Actions */}
                        {showActions && (
                            <div className="flex gap-2 mt-3">
                                <Link href={report.fileUrl} target="_blank" download>
                                    <Button size="sm" variant="outline" className="text-xs">
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                    </Button>
                                </Link>
                                {onDelete && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => onDelete(report.id)}
                                    >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Delete
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
