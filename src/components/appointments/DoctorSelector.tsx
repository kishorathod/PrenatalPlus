"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Stethoscope } from "lucide-react"
import { cn } from "@/lib/utils"

interface Doctor {
    id: string
    name: string
    specialization: string | null
    avatar?: string | null
}

interface DoctorSelectorProps {
    doctors: Doctor[]
    selectedDoctorId: string | null
    onSelect: (doctorId: string) => void
}

export function DoctorSelector({ doctors, selectedDoctorId, onSelect }: DoctorSelectorProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => {
                const isSelected = selectedDoctorId === doctor.id
                return (
                    <Card
                        key={doctor.id}
                        className={cn(
                            "cursor-pointer transition-all hover:shadow-md border-2",
                            isSelected ? "border-pink-500 bg-pink-50/50" : "border-transparent hover:border-pink-200"
                        )}
                        onClick={() => onSelect(doctor.id)}
                    >
                        <CardContent className="p-4 flex items-start gap-4">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage src={doctor.avatar || ""} />
                                <AvatarFallback className="bg-pink-100 text-pink-700">
                                    {doctor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                    <Stethoscope className="h-3 w-3" />
                                    <span>{doctor.specialization || "General Obstetrician"}</span>
                                </div>
                                {isSelected && (
                                    <Badge className="bg-pink-500 hover:bg-pink-600">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Selected
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
