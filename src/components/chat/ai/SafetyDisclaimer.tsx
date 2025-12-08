import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SafetyDisclaimer() {
    return (
        <Alert className="bg-amber-50 border-amber-200 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 font-semibold">Not a Medical Professional</AlertTitle>
            <AlertDescription className="text-amber-700 text-sm mt-1">
                I am an AI assistant for educational purposes only. I cannot diagnose medical conditions.
                <br />
                <strong>In case of emergency, bleeding, or severe pain, please contact your doctor immediately.</strong>
            </AlertDescription>
        </Alert>
    )
}
