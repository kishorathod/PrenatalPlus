import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { KickCounter } from "@/components/patient/KickCounter"
import { ContractionTimer } from "@/components/patient/ContractionTimer"
import { Baby, Heart } from "lucide-react"

export default async function PregnancyToolsPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div className="container mx-auto px-6 py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-pink-100 rounded-xl">
                        <Baby className="h-6 w-6 text-pink-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Pregnancy Tools
                    </h1>
                </div>
                <p className="text-gray-600 ml-[60px]">
                    Track your baby's movements and labor contractions
                </p>
            </div>

            {/* Info Banner */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-8">
                <div className="flex gap-3">
                    <Heart className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-pink-900 mb-1">Important Information</h3>
                        <ul className="text-sm text-pink-800 space-y-1">
                            <li>• <strong>Kick Counter:</strong> Use daily in the third trimester. Contact your doctor if you notice decreased movement.</li>
                            <li>• <strong>Contraction Timer:</strong> Track contractions during labor. Head to the hospital when they're 5 minutes apart, lasting 1 minute, for 1 hour (5-1-1 rule).</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
                <KickCounter />
                <ContractionTimer />
            </div>
        </div>
    )
}
