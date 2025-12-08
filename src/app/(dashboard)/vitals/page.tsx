"use client"

import { useEffect } from "react"
import { useVitals } from "@/hooks/useVitals"
import { VitalsCard } from "@/components/features/vitals/VitalsCard"
import { VitalsWidgets } from "@/components/features/vitals/VitalsWidgets"
import { Button } from "@/components/ui/button"
import { Plus, Heart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EnhancedVitalsForm } from "@/components/features/vitals/EnhancedVitalsForm"
import { Loading } from "@/components/ui/loading"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSession } from "next-auth/react"

export default function VitalsPage() {
  const {
    vitals,
    isLoading,
    error,
    fetchVitals,
    deleteVital,
  } = useVitals()
  const { data: session } = useSession()

  useEffect(() => {
    fetchVitals()
  }, [fetchVitals])

  const handleDelete = async (id: string) => {
    try {
      await deleteVital(id)
    } catch (error) {
      console.error("Failed to delete vital:", error)
    }
  }

  if (isLoading) {
    return <Loading size="lg" text="Loading vitals..." />
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vitals</h1>
          <p className="text-muted-foreground mt-2">
            Track your vital signs throughout pregnancy
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Vital
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record Vital Signs</DialogTitle>
              <DialogDescription>
                Quick entry with smart insights
              </DialogDescription>
            </DialogHeader>
            <EnhancedVitalsForm
              onSuccess={() => {
                fetchVitals()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Mini Widgets */}
      {session?.user?.id && <VitalsWidgets userId={session.user.id} />}

      {vitals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No vitals recorded</h3>
          <p className="text-muted-foreground mb-4">
            Start tracking your vital signs
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Vital
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record Vital Signs</DialogTitle>
                <DialogDescription>
                  Quick entry with smart insights
                </DialogDescription>
              </DialogHeader>
              <EnhancedVitalsForm
                onSuccess={() => {
                  fetchVitals()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vitals.map((vital) => (
            <VitalsCard
              key={vital.id}
              vital={vital}
              onEdit={() => fetchVitals()}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}


