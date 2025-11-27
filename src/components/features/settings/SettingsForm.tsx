"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { z } from "zod"

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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const notificationSettingsSchema = z.object({
    emailEnabled: z.boolean(),
    emailAppointmentReminders: z.boolean(),
    emailVitalReminders: z.boolean(),
    emailReportAlerts: z.boolean(),
    pushEnabled: z.boolean(),
    pushAppointmentReminders: z.boolean(),
    pushVitalReminders: z.boolean(),
    pushReportAlerts: z.boolean(),
})

type NotificationSettingsInput = z.infer<typeof notificationSettingsSchema>

export function SettingsForm() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)

    const form = useForm<NotificationSettingsInput>({
        resolver: zodResolver(notificationSettingsSchema),
        defaultValues: {
            emailEnabled: true,
            emailAppointmentReminders: true,
            emailVitalReminders: true,
            emailReportAlerts: true,
            pushEnabled: true,
            pushAppointmentReminders: true,
            pushVitalReminders: true,
            pushReportAlerts: true,
        },
    })

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch("/api/settings/notifications")
                if (!response.ok) throw new Error("Failed to fetch settings")
                const data = await response.json()

                form.reset({
                    emailEnabled: data.emailEnabled,
                    emailAppointmentReminders: data.emailAppointmentReminders,
                    emailVitalReminders: data.emailVitalReminders,
                    emailReportAlerts: data.emailReportAlerts,
                    pushEnabled: data.pushEnabled,
                    pushAppointmentReminders: data.pushAppointmentReminders,
                    pushVitalReminders: data.pushVitalReminders,
                    pushReportAlerts: data.pushReportAlerts,
                })
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load settings",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchSettings()
    }, [form, toast])

    async function onSubmit(data: NotificationSettingsInput) {
        try {
            const response = await fetch("/api/settings/notifications", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error("Failed to update settings")

            toast({
                title: "Success",
                description: "Settings updated successfully",
            })
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update settings",
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
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>
                        Manage your email notification preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="emailEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Email Notifications</FormLabel>
                                            <FormDescription>
                                                Receive notifications via email.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {form.watch("emailEnabled") && (
                                <div className="pl-4 space-y-4 border-l-2 ml-4">
                                    <FormField
                                        control={form.control}
                                        name="emailAppointmentReminders"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Appointment Reminders</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="emailVitalReminders"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Vital Check-in Reminders</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="emailReportAlerts"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <FormLabel>New Report Alerts</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Push Notifications</CardTitle>
                    <CardDescription>
                        Manage your push notification preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="pushEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Push Notifications</FormLabel>
                                            <FormDescription>
                                                Receive notifications on your device.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {form.watch("pushEnabled") && (
                                <div className="pl-4 space-y-4 border-l-2 ml-4">
                                    <FormField
                                        control={form.control}
                                        name="pushAppointmentReminders"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Appointment Reminders</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pushVitalReminders"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Vital Check-in Reminders</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pushReportAlerts"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <FormLabel>New Report Alerts</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Preferences
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
