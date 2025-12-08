import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getMedicationReminders } from "@/server/actions/medications"
import { MedicationList } from "@/components/medications/MedicationList"
import { MedicationForm } from "@/components/medications/MedicationForm"
import { Button } from "@/components/ui/button"
import { Plus, Pill } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default async function MedicationsPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    const { reminders } = await getMedicationReminders()

    return (
        <div className="container mx-auto px-6 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Pill className="h-8 w-8 text-blue-500" />
                        Medications
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Track your daily medications and supplements
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Medication
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Medication Reminder</DialogTitle>
                            <DialogDescription>
                                Set up a schedule for your medication or supplement
                            </DialogDescription>
                        </DialogHeader>
                        <MedicationForm />
                    </DialogContent>
                </Dialog>
            </div>

            <MedicationList reminders={reminders || []} />
        </div>
    )
}
