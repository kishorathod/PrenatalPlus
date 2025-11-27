"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth.validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Phone, Calendar, Lock, Eye, EyeOff } from "lucide-react"

export function RegisterForm({ role = "patient" }: { role?: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Registration failed")
        setIsLoading(false)
        return
      }

      // Auto-login after registration
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: "/dashboard",
      })
    } catch (err) {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg border-0 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl overflow-hidden bg-gradient-to-br from-[#FAFBFF] to-[#F0F4FF]">
      <CardHeader className="space-y-3 pb-6 pt-8 px-8">
        <CardTitle className="text-2xl font-semibold text-center text-gray-900">Create Account</CardTitle>
        <CardDescription className="text-center text-gray-500 text-sm">
          {role === "doctor" ? "Join as a healthcare provider" : role === "admin" ? "System administrator registration" : "Sign up to start tracking your prenatal care"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="rounded-xl border-0 bg-red-50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium text-sm">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B82F6]/60" />
              <Input
                id="name"
                type="text"
                placeholder={role === "doctor" ? "Dr. John Doe" : "John Doe"}
                className="pl-10 h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm"
                {...register("name")}
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1.5">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B82F6]/60" />
              <Input
                id="email"
                type="email"
                placeholder={role === "doctor" ? "doctor@hospital.com" : "you@example.com"}
                className="pl-10 h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm"
                {...register("email")}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium text-sm">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B82F6]/60" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91"
                  className="pl-10 h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm"
                  {...register("phone")}
                  disabled={isLoading}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1.5">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium text-sm">Birth Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B82F6]/60 pointer-events-none" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  className="pl-10 h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm"
                  {...register("dateOfBirth")}
                  disabled={isLoading}
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-xs text-red-500 mt-1.5">{errors.dateOfBirth.message}</p>
              )}
            </div>
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium text-sm">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B82F6]/60" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm"
                {...register("confirmPassword")}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 px-0 hover:bg-[#E0E8FF]/50 text-[#3B82F6]/60 hover:text-[#3B82F6]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white shadow-md shadow-[#3B82F6]/20 text-sm font-medium transition-all hover:shadow-lg hover:shadow-[#3B82F6]/30 mt-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
