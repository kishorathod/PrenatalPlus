"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { updateUserSchema, type UpdateUserInput } from "@/lib/validations/user.validation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfileForm() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)

    const form = useForm<UpdateUserInput>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
        },
    })

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch("/api/profile")
                if (!response.ok) throw new Error("Failed to fetch profile")
                const data = await response.json()

                form.reset({
                    name: data.name || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    city: data.city || "",
                    state: data.state || "",
                    zipCode: data.zipCode || "",
                    country: data.country || "",
                    // Handle dateOfBirth if needed, might need formatting
                })
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load profile data",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [form, toast])

    async function onSubmit(data: UpdateUserInput) {
        try {
            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error("Failed to update profile")

            toast({
                title: "Success",
                description: "Profile updated successfully",
            })
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your personal information and contact details.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 234 567 890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Add Date of Birth field if needed */}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">Address</h3>
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123 Main St" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="New York" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State/Province</FormLabel>
                                            <FormControl>
                                                <Input placeholder="NY" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="zipCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Zip/Postal Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="10001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country</FormLabel>
                                            <FormControl>
                                                <Input placeholder="United States" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
