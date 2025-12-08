import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus } from "lucide-react"

async function assignDoctor(formData: FormData) {
    "use server"

    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const doctorId = formData.get("doctorId") as string

    try {
        // Check if assignment already exists
        const existing = await prisma.patientAssignment.findFirst({
            where: {
                patientId: session.user.id,
                doctorId: doctorId,
                status: "ACTIVE"
            }
        })

        if (existing) {
            return { error: "Already assigned to this doctor" }
        }

        // Create assignment
        await prisma.patientAssignment.create({
            data: {
                patientId: session.user.id,
                doctorId: doctorId,
                status: "ACTIVE",
                assignedAt: new Date()
            }
        })

        redirect("/patient/chat")
    } catch (error) {
        console.error("Error assigning doctor:", error)
        return { error: "Failed to assign doctor" }
    }
}

export default async function AssignDoctorPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    // Check if already assigned
    const existingAssignment = await prisma.patientAssignment.findFirst({
        where: {
            patientId: session.user.id,
            status: "ACTIVE"
        },
        include: {
            doctor: {
                select: {
                    name: true,
                    specialization: true
                }
            }
        }
    })

    if (existingAssignment) {
        redirect("/patient/chat")
    }

    // Get available doctors
    const doctors = await prisma.user.findMany({
        where: {
            role: "DOCTOR"
        },
        select: {
            id: true,
            name: true,
            email: true,
            specialization: true
        }
    })

    return (
        <div className="container mx-auto px-6 py-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-6 w-6 text-pink-500" />
                        Assign Your Doctor
                    </CardTitle>
                    <CardDescription>
                        Select a doctor to enable chat and get personalized care
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {doctors.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No doctors available. Please contact support.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {doctors.map((doctor) => (
                                <form key={doctor.id} action={assignDoctor as any}>
                                    <input type="hidden" name="doctorId" value={doctor.id} />
                                    <Card className="hover:border-pink-200 transition-colors cursor-pointer">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    Dr. {doctor.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {doctor.specialization || "General Obstetrician"}
                                                </p>
                                                <p className="text-xs text-gray-400">{doctor.email}</p>
                                            </div>
                                            <Button
                                                type="submit"
                                                className="bg-pink-500 hover:bg-pink-600"
                                            >
                                                Select
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </form>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
