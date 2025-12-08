"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DoctorSelector } from "./DoctorSelector"
import { TimeSlotPicker } from "./TimeSlotPicker"
import { getAvailableSlots, bookAppointment } from "@/server/actions/appointment"
import { format } from "date-fns"
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface Doctor {
    id: string
    name: string
    specialization: string | null
    image?: string | null
}

interface BookingWizardProps {
    doctors: Doctor[]
}

export function BookingWizard({ doctors }: BookingWizardProps) {
    const router = useRouter()
    const { toast } = useToast()

    const [step, setStep] = useState(1)
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [isBooking, setIsBooking] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const selectedDoctor = doctors.find(d => d.id === selectedDoctorId)

    // Fetch slots when doctor or date changes
    useEffect(() => {
        if (selectedDoctorId && selectedDate && step === 2) {
            const fetchSlots = async () => {
                setIsLoadingSlots(true)
                setSelectedSlot(null) // Reset slot selection
                try {
                    const result = await getAvailableSlots(selectedDoctorId, selectedDate.toISOString())
                    if (result.error) {
                        console.error(result.error)
                        setAvailableSlots([])
                    } else {
                        setAvailableSlots(result.slots || [])
                    }
                } catch (err) {
                    console.error(err)
                } finally {
                    setIsLoadingSlots(false)
                }
            }
            fetchSlots()
        }
    }, [selectedDoctorId, selectedDate, step])

    const handleNext = () => {
        if (step === 1 && selectedDoctorId) setStep(2)
        else if (step === 2 && selectedSlot) setStep(3)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleBook = async () => {
        if (!selectedDoctorId || !selectedSlot) return

        setIsBooking(true)
        setError(null)

        try {
            const result = await bookAppointment({
                doctorId: selectedDoctorId,
                date: selectedSlot,
                reason: "Routine Checkup", // Could add input for this
                type: "ROUTINE_CHECKUP"
            })

            if (result.error) {
                setError(result.error)
                toast({
                    title: "Booking Failed",
                    description: result.error,
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Appointment Booked!",
                    description: "Your appointment has been successfully scheduled.",
                })
                router.push("/patient/appointments")
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setIsBooking(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                            ${step >= s ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}
                        `}>
                            {s}
                        </div>
                        {s < 3 && (
                            <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-pink-500' : 'bg-gray-200'}`} />
                        )}
                    </div>
                ))}
            </div>

            <Card className="border-gray-100 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        {step === 1 && "Select a Doctor"}
                        {step === 2 && "Choose Date & Time"}
                        {step === 3 && "Confirm Appointment"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Choose a specialist for your visit"}
                        {step === 2 && "Select a convenient time slot"}
                        {step === 3 && "Review your booking details"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-h-[400px]">
                    {step === 1 && (
                        <DoctorSelector
                            doctors={doctors}
                            selectedDoctorId={selectedDoctorId}
                            onSelect={setSelectedDoctorId}
                        />
                    )}

                    {step === 2 && (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-pink-500" />
                                    Select Date
                                </h3>
                                <div className="border rounded-lg p-4 flex justify-center">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        className="rounded-md"
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-pink-500" />
                                    Select Time
                                </h3>
                                <TimeSlotPicker
                                    slots={availableSlots}
                                    selectedSlot={selectedSlot}
                                    onSelect={setSelectedSlot}
                                    isLoading={isLoadingSlots}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && selectedDoctor && selectedSlot && (
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="bg-pink-50 p-6 rounded-xl border border-pink-100 text-center">
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CalendarIcon className="h-8 w-8 text-pink-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {format(new Date(selectedSlot), "EEEE, MMMM d, yyyy")}
                                </h3>
                                <p className="text-2xl font-bold text-pink-600 mb-4">
                                    {format(new Date(selectedSlot), "h:mm a")}
                                </p>
                                <div className="flex items-center justify-center gap-2 text-gray-600">
                                    <span className="font-medium">with Dr. {selectedDoctor.name}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedDoctor.specialization || "General Obstetrician"}
                                </p>
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-900 mb-2">Note</h4>
                                <p className="text-sm text-blue-800">
                                    Please arrive 15 minutes before your scheduled time.
                                    Bring your previous medical reports if any.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 1 || isBooking}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    {step < 3 ? (
                        <Button
                            onClick={handleNext}
                            disabled={
                                (step === 1 && !selectedDoctorId) ||
                                (step === 2 && !selectedSlot)
                            }
                            className="bg-pink-500 hover:bg-pink-600"
                        >
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleBook}
                            disabled={isBooking}
                            className="bg-pink-500 hover:bg-pink-600 min-w-[140px]"
                        >
                            {isBooking ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Booking...
                                </>
                            ) : (
                                <>
                                    Confirm Booking
                                    <CheckCircle className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

// Helper icon component since I missed importing Clock
function Clock({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
