"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getDoctorNotes } from "@/server/actions/doctor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

export default function DoctorNotesPage() {
    const [notes, setNotes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchNotes() {
            const { notes: fetchedNotes } = await getDoctorNotes()
            setNotes(fetchedNotes || [])
            setLoading(false)
        }
        fetchNotes()
    }, [])

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Medical Notes</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Note
                </Button>
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
