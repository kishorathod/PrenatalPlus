"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { loginSchema, type LoginInput } from "@/lib/validations/auth.validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { UserRole } from "@prisma/client"

interface LoginFormProps {
  expectedRole?: UserRole
}

export function LoginForm({ expectedRole }: LoginFormProps = {}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)

    try {
      // Use signIn with redirect true - middleware will handle role-based routing
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        expectedRole: expectedRole,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      } else if (result?.ok) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="rounded-xl border-0 bg-red-50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B82F6]/60" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm"
                {...register("email")}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B82F6]/60" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm"
                {...register("password")}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 px-0 hover:bg-[#E0E8FF]/50 text-[#3B82F6]/60 hover:text-[#3B82F6]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white shadow-md shadow-[#3B82F6]/20 text-sm font-medium transition-all hover:shadow-lg hover:shadow-[#3B82F6]/30 mt-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
