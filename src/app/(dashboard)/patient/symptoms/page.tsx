import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { SymptomChecker } from "@/components/patient/SymptomChecker"
import { Stethoscope } from "lucide-react"

export default async function SymptomsPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div className="container mx-auto px-6 py-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-pink-100 rounded-xl">
                        <Stethoscope className="h-6 w-6 text-pink-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        AI Symptom Checker
                    </h1>
                </div>
                <p className="text-gray-600 ml-[60px]">
                    Get instant AI-powered analysis of your symptoms and personalized recommendations
                </p>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                    <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-lg">ℹ️</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-1">How It Works</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Select the symptoms you're experiencing</li>
                            <li>• Add any additional details (optional)</li>
                            <li>• Get instant AI analysis with severity assessment</li>
                            <li>• Receive personalized recommendations</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Symptom Checker Component */}
            <SymptomChecker />
        </div>
    )
}
