import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingProps {
  className?: string
  size?: "sm" | "md" | "lg"
  text?: string
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
}

export function Loading({ className, size = "md", text }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export function LoadingSpinner({ className, size = "md" }: Omit<LoadingProps, "text">) {
  return (
    <Loader2 className={cn("animate-spin text-primary", sizeClasses[size], className)} />
  )
}

export function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading size="lg" text="Loading..." />
    </div>
  )
}


