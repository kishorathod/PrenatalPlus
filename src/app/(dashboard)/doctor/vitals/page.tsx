"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function DoctorVitalsPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Patient Vitals History</h1>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search patient to view vitals..." className="pl-8" />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vitals Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Select a patient to view vitals history.</p>
                </CardContent>
            </Card>
        </div>
    )
}
