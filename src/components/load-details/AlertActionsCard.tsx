"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast";
import { intelligentNotifications } from "@/ai/flows/intelligent-notifications";
import { Load } from "@/lib/types";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AlertActionsCardProps {
  load: Load;
}

export function AlertActionsCard({ load }: AlertActionsCardProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAcknowledge = () => {
    toast({
      title: "Acknowledged",
      description: `Risk for load ${load.load_ref} has been acknowledged.`,
    });
  };

  async function handleSendNotification(formData: FormData) {
    setIsSubmitting(true);
    const reason = formData.get('reason') as string;

    const now = new Date();
    // In a real app, this would be the driver's local time
    const currentHour = now.getHours(); 

    try {
      const result = await intelligentNotifications({
        loadRef: load.load_ref,
        deliveryCity: load.delivery_city,
        deliveryState: load.delivery_state,
        apptLocal: load.delivery_appointment,
        etaLocal: load.lastEtaISO || '',
        reason: reason,
        buffer: 30, // Example buffer
        ackUrl: `https://example.com/ack/${load.id}`,
        driverPhone: load.driver_phone,
        dispatcherPhone: '+15550001111', // Placeholder
        quietHoursStart: 22,
        quietHoursEnd: 6,
        allowNightCalls: false,
        alertOwnerPhone: '+15552223333', // Placeholder
        currentHour: currentHour,
        driverName: load.driver_name,
        lastDrivingStart: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // Assume driving for 4 hours
        status: load.lastStatus,
      });

      toast({
        title: "Notification Sent",
        description: result.message,
      });

      setOpen(false);

    } catch (error) {
       toast({
        variant: "destructive",
        title: "Failed to send notification",
        description: "An error occurred while processing the notification.",
      });
    } finally {
        setIsSubmitting(false);
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-sm text-muted-foreground">
          Acknowledge risks or send updates to the driver. All notifications are intelligently handled based on time of day and driver status.
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={handleAcknowledge} disabled={load.lastStatus === 'OK'}>
            Acknowledge Risk
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Send Update to Driver</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form action={handleSendNotification}>
                <DialogHeader>
                  <DialogTitle>Send Intelligent Notification</DialogTitle>
                  <DialogDescription>
                    Enter a reason or instructions for the driver. The system will determine the best way to send it (SMS, Voice, etc.).
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="e.g., 'Take exit 42 for an alternate route due to accident ahead.'"
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Notification
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
