"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, User } from "lucide-react"
import { getDoctorNotes, getDoctorPatients } from "@/server/actions/doctor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DoctorNotesPage() {
    const [notes, setNotes] = useState<any[]>([])
    const [patients, setPatients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [open, setOpen] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const [{ notes: fetchedNotes }, { patients: fetchedPatients }] = await Promise.all([
                getDoctorNotes(),
                getDoctorPatients()
            ])
            setNotes(fetchedNotes || [])
            setPatients(fetchedPatients || [])
            setLoading(false)
        }
        fetchData()
    }, [])

    const filteredPatients = patients.filter(patient =>
        patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Medical Notes</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Note
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Select Patient</DialogTitle>
                            <DialogDescription>
                                Select a patient to add a medical note to their file.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search patients..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <ScrollArea className="h-[300px] rounded-md border p-2">
                                {filteredPatients.length > 0 ? (
                                    <div className="space-y-2">
                                        {filteredPatients.map((patient) => (
                                            <Link
                                                key={patient.id}
                                                href={`/doctor/patients/${patient.id}`}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg transition-colors"
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.email}`} />
                                                    <AvatarFallback>{patient.name?.[0] || "P"}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="font-medium truncate">{patient.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{patient.email}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No patients found
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-sm text-muted-foreground text-center py-8">Loading notes...</p>
                    ) : notes.length > 0 ? (
                        <div className="space-y-4">
                            {notes.map((note) => (
                                <div key={note.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${note.patient.email}`} />
                                                <AvatarFallback>{note.patient.name?.[0] || "P"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{note.patient.name}</p>
                                                <p className="text-sm text-muted-foreground">{note.patient.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline">{note.category}</Badge>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No notes available.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
