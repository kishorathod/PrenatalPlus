"use client"

import { RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { refreshDashboard } from "@/server/actions/dashboard"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function RefreshButton() {
    const router = useRouter()
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refreshDashboard()
        router.refresh()
        setTimeout(() => setIsRefreshing(false), 500)
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
        >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
        </Button>
    )
}
