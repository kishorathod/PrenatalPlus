import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { getDoctors } from "@/server/actions/appointment"
import { BookingWizard } from "@/components/appointments/BookingWizard"
import { CalendarPlus } from "lucide-react"

export default async function BookAppointmentPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    const { doctors, error } = await getDoctors()

    if (error || !doctors) {
        return (
            <div className="p-8 text-center text-red-500">
                Failed to load doctors. Please try again later.
            </div>
        )
    }

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-pink-100 rounded-full mb-4">
                    <CalendarPlus className="h-8 w-8 text-pink-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Book an Appointment
                </h1>
                <p className="text-gray-600 max-w-md mx-auto">
                    Schedule a visit with one of our specialists. Select a doctor, choose a date, and pick a time that works for you.
                </p>
            </div>

            <BookingWizard doctors={doctors as any} />
        </div>
    )
}
