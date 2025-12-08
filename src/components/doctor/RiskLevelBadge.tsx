"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updatePatientRiskLevel } from "@/server/actions/doctor"
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"

interface RiskLevelBadgeProps {
    pregnancyId: string
    currentRiskLevel: "LOW" | "MEDIUM" | "HIGH"
    editable?: boolean
}

const riskConfig = {
    LOW: {
        label: "Low Risk",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
    },
    MEDIUM: {
        label: "Medium Risk",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertCircle,
    },
    HIGH: {
        label: "High Risk",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: AlertTriangle,
    },
}

export function RiskLevelBadge({ pregnancyId, currentRiskLevel, editable = false }: RiskLevelBadgeProps) {
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter()
    const config = riskConfig[currentRiskLevel]
    const Icon = config.icon

    const handleUpdate = async (newRiskLevel: "LOW" | "MEDIUM" | "HIGH") => {
        if (newRiskLevel === currentRiskLevel) return

        setIsUpdating(true)
        try {
            const result = await updatePatientRiskLevel(pregnancyId, newRiskLevel)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(`Risk level updated to ${riskConfig[newRiskLevel].label}`)
                router.refresh()
            }
        } catch (error) {
            toast.error("Failed to update risk level")
        } finally {
            setIsUpdating(false)
        }
    }

    if (!editable) {
        return (
            <Badge variant="outline" className={config.color}>
                <Icon className="mr-1 h-3 w-3" />
                {config.label}
            </Badge>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={config.color} disabled={isUpdating}>
                    <Icon className="mr-1 h-3 w-3" />
                    {config.label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Update Risk Level</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(riskConfig).map(([level, conf]) => {
                    const LevelIcon = conf.icon
                    return (
                        <DropdownMenuItem
                            key={level}
                            onClick={() => handleUpdate(level as "LOW" | "MEDIUM" | "HIGH")}
                            disabled={level === currentRiskLevel}
                        >
                            <LevelIcon className="mr-2 h-4 w-4" />
                            {conf.label}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
