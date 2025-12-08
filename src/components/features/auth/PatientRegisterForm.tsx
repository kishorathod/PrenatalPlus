"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { patientRegisterSchema, type PatientRegisterInput } from "@/lib/validations/auth.validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Phone, Calendar, Lock, Eye, EyeOff, Heart, UserPlus } from "lucide-react"

export function PatientRegisterForm() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PatientRegisterInput>({
        resolver: zodResolver(patientRegisterSchema),
    })

    const onSubmit = async (data: PatientRegisterInput) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, role: "patient" }),
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
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
            <CardContent className="p-0">
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
                                placeholder="John Doe"
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700 font-medium text-sm">Phone</Label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B82F6]/60" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="9876543210"
                                    maxLength={10}
                                    className="pl-10 h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm"
                                    {...register("phone")}
                                    disabled={isLoading}
                                    onInput={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        target.value = target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                    }}
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-xs text-red-500 mt-1.5">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium text-sm">Birth Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B82F6]/60 pointer-events-none z-10" />
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    max={new Date().toISOString().split('T')[0]}
                                    className="pl-10 h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
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
                        <Label htmlFor="expectedDueDate" className="text-gray-700 font-medium text-sm flex items-center gap-2">
                            <Heart className="h-3.5 w-3.5 text-healthcare-pink" />
                            Expected Due Date <span className="text-xs text-gray-400">(Optional)</span>
                        </Label>
                        <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B82F6]/60 pointer-events-none z-10" />
                            <Input
                                id="expectedDueDate"
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                className="pl-10 h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
                                {...register("expectedDueDate")}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.expectedDueDate && (
                            <p className="text-xs text-red-500 mt-1.5">{errors.expectedDueDate.message}</p>
                        )}
                    </div>

                    {/* Emergency Contact Section */}
                    <div className="pt-2 border-t border-gray-100">
                        <Label className="text-gray-700 font-medium text-sm flex items-center gap-2 mb-3">
                            <UserPlus className="h-3.5 w-3.5 text-healthcare-mint" />
                            Emergency Contact <span className="text-xs text-gray-400">(Optional)</span>
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="emergencyContactName" className="text-gray-600 text-xs">Name</Label>
                                <Input
                                    id="emergencyContactName"
                                    type="text"
                                    placeholder="Jane Doe"
                                    className="h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm"
                                    {...register("emergencyContactName")}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emergencyContactPhone" className="text-gray-600 text-xs">Phone</Label>
                                <Input
                                    id="emergencyContactPhone"
                                    type="tel"
                                    placeholder="9876543210"
                                    maxLength={10}
                                    className="h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm"
                                    {...register("emergencyContactPhone")}
                                    disabled={isLoading}
                                    onInput={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        target.value = target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                    }}
                                />
                                {errors.emergencyContactPhone && (
                                    <p className="text-xs text-red-500 mt-1.5">{errors.emergencyContactPhone.message}</p>
                                )}
                            </div>
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
