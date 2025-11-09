"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { GlobalSettings } from "@/lib/types"

const settingsFormSchema = z.object({
  timezoneDefault: z.string(),
  defaultBufferMin: z.coerce.number().min(0),
  quietHoursStart: z.coerce.number().min(0).max(23),
  quietHoursEnd: z.coerce.number().min(0).max(23),
  allowNightCalls: z.boolean(),
  dailyGmapsCap: z.coerce.number().min(0),
  pollIntervalMinDefault: z.coerce.number().min(1),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

interface SettingsFormProps {
  settings: GlobalSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      ...settings
    },
  })

  function onSubmit(data: SettingsFormValues) {
    toast({
      title: "Settings Saved",
      description: "Your global settings have been updated.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Time & Buffer</CardTitle>
                <CardDescription>Configure default time zones and alert buffers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="timezoneDefault"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Default Timezone</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., America/Chicago" {...field} />
                        </FormControl>
                        <FormDescription>
                            Default IANA timezone for calculations.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="defaultBufferMin"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Default Buffer (minutes)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                            The default time buffer before an appointment to trigger a 'WATCH' status.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Quiet Hours & Notifications</CardTitle>
                <CardDescription>Set do-not-disturb periods for drivers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="quietHoursStart"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Quiet Hours Start</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="22" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="quietHoursEnd"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Quiet Hours End</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="6" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="allowNightCalls"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">
                            Allow Night Calls
                            </FormLabel>
                            <FormDescription>
                            Allow voice calls for critical alerts during quiet hours.
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
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>API & Polling</CardTitle>
                <CardDescription>Manage costs and frequency of external API calls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="dailyGmapsCap"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Daily Google Maps API Cap</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                            Maximum number of Google Maps API calls per day to control costs.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pollIntervalMinDefault"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Default Poll Interval (minutes)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                           Base interval for checking load statuses.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
        
        <Button type="submit">Save Settings</Button>
      </form>
    </Form>
  )
}
