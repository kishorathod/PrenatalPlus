"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { adminRegisterSchema, type AdminRegisterInput } from "@/lib/validations/auth.validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User, Mail, Lock, Eye, EyeOff, Shield, Building } from "lucide-react"

export function AdminRegisterForm() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<AdminRegisterInput>({
        resolver: zodResolver(adminRegisterSchema),
    })

    const onSubmit = async (data: AdminRegisterInput) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, role: "admin" }),
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
                                placeholder="admin@prenatalplus.com"
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
                        <Label htmlFor="adminRole" className="text-gray-700 font-medium text-sm flex items-center gap-2">
                            <Shield className="h-3.5 w-3.5 text-healthcare-lavender" />
                            Admin Role
                        </Label>
                        <Select onValueChange={(value) => setValue("adminRole", value as "SUPER_ADMIN" | "DEPARTMENT_ADMIN" | "SUPPORT_ADMIN")} disabled={isLoading}>
                            <SelectTrigger className="h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white">
                                <SelectValue placeholder="Select admin role..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                <SelectItem value="DEPARTMENT_ADMIN">Department Admin</SelectItem>
                                <SelectItem value="SUPPORT_ADMIN">Support Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.adminRole && (
                            <p className="text-xs text-red-500 mt-1.5">{errors.adminRole.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="department" className="text-gray-700 font-medium text-sm flex items-center gap-2">
                            <Building className="h-3.5 w-3.5 text-healthcare-mint" />
                            Department <span className="text-xs text-gray-400">(Optional)</span>
                        </Label>
                        <Input
                            id="department"
                            type="text"
                            placeholder="Operations, IT, Support, etc."
                            className="h-11 rounded-xl border-[#E0E8FF] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white hover:border-[#3B82F6]/50 transition-all text-sm"
                            {...register("department")}
                            disabled={isLoading}
                        />
                        {errors.department && (
                            <p className="text-xs text-red-500 mt-1.5">{errors.department.message}</p>
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
