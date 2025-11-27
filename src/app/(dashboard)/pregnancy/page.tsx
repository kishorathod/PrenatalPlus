"use client"

import { useState } from "react"
import { usePregnancy } from "@/hooks/usePregnancy"
import { PregnancyProgress } from "@/components/features/pregnancy/PregnancyProgress"
import { PregnancyForm } from "@/components/features/pregnancy/PregnancyForm"
import { PregnancyList } from "@/components/features/pregnancy/PregnancyList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loading } from "@/components/ui/loading"
import { Baby, Plus } from "lucide-react"

export default function PregnancyPage() {
    const { pregnancies, activePregnancy, isLoading, error } = usePregnancy()
    const [showNewPregnancyDialog, setShowNewPregnancyDialog] = useState(false)

    const completedPregnancies = pregnancies.filter(p => p.status === "COMPLETED")

    if (isLoading) {
        return <Loading size="lg" text="Loading pregnancy data..." />
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Baby className="h-8 w-8" />
                        Pregnancy Tracking
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Track your pregnancy journey and monitor your progress
                    </p>
                </div>
                {!activePregnancy && (
                    <Button onClick={() => setShowNewPregnancyDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Start New Pregnancy
                    </Button>
                )}
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Active Pregnancy Section */}
            {activePregnancy ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <PregnancyProgress pregnancy={activePregnancy} />

                    <Card>
                        <CardHeader>
                            <CardTitle>Medical Information</CardTitle>
                            <CardDescription>Your pregnancy details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                {activePregnancy.bloodType && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Blood Type</p>
                                        <p className="font-semibold">
                                            {activePregnancy.bloodType}
                                            {activePregnancy.rhFactor && ` ${activePregnancy.rhFactor}`}
                                        </p>
                                    </div>
                                )}
                                {activePregnancy.height && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Height</p>
                                        <p className="font-semibold">{activePregnancy.height} cm</p>
                                    </div>
                                )}
                                {activePregnancy.prePregnancyWeight && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pre-pregnancy Weight</p>
                                        <p className="font-semibold">{activePregnancy.prePregnancyWeight} kg</p>
                                    </div>
                                )}
                            </div>
                            {!activePregnancy.bloodType && !activePregnancy.height && !activePregnancy.prePregnancyWeight && (
                                <p className="text-sm text-muted-foreground">
                                    No additional medical information recorded yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No Active Pregnancy</CardTitle>
                        <CardDescription>
                            Start tracking your pregnancy journey by creating a new pregnancy record
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => setShowNewPregnancyDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Start New Pregnancy
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Pregnancy History */}
            {completedPregnancies.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Pregnancy History</h2>
                    <PregnancyList pregnancies={completedPregnancies} />
                </div>
            )}

            {/* New Pregnancy Dialog */}
            <Dialog open={showNewPregnancyDialog} onOpenChange={setShowNewPregnancyDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Start New Pregnancy</DialogTitle>
                        <DialogDescription>
                            Enter your pregnancy details to start tracking your journey
                        </DialogDescription>
                    </DialogHeader>
                    <PregnancyForm
                        onSuccess={() => setShowNewPregnancyDialog(false)}
                        onCancel={() => setShowNewPregnancyDialog(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
