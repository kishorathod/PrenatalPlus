import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { WeeklyPregnancyInfo } from "@/components/patient/WeeklyPregnancyInfo"
import { BookOpen, Baby } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default async function WeeklyInfoPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    // Get active pregnancy
    const pregnancy = await prisma.pregnancy.findFirst({
        where: {
            userId: session.user.id,
            status: "ACTIVE"
        },
        orderBy: { createdAt: "desc" }
    })

    const currentWeek = pregnancy?.currentWeek || 20 // Default to week 20 if no active pregnancy

    return (
        <div className="container mx-auto px-6 py-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Weekly Pregnancy Guide
                    </h1>
                </div>
                <p className="text-gray-600 ml-[60px]">
                    Learn about your baby's development week by week
                </p>
            </div>

            {/* No Active Pregnancy Alert */}
            {!pregnancy && (
                <Alert className="mb-6 bg-blue-50 border-blue-200">
                    <Baby className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-900">
                        You don't have an active pregnancy tracked. The guide is showing week 20 as an example.
                        Start tracking your pregnancy to see personalized weekly information.
                    </AlertDescription>
                </Alert>
            )}

            {/* Weekly Info Component */}
            <WeeklyPregnancyInfo currentWeek={currentWeek} />
        </div>
    )
}
