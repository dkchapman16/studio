import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Load } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { Truck, User, Phone, MapPin, Flag, Clock } from "lucide-react";
import { StatusBadge } from "../dashboard/StatusBadge";

interface LoadInfoCardProps {
  load: Load;
}

export function LoadInfoCard({ load }: LoadInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Load Details</CardTitle>
        <CardDescription className="flex items-center gap-2">
            <StatusBadge status={load.lastStatus}/>
            <span>- {load.lastReason}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Separator />
        <div className="font-semibold text-lg font-headline">Driver & Truck</div>
        <ul className="grid gap-3 text-sm">
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" /> Driver
            </span>
            <span>{load.driver_name}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" /> Phone
            </span>
            <span>{load.driver_phone}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Truck className="h-4 w-4" /> Truck Unit
            </span>
            <span>{load.truck_unit}</span>
          </li>
        </ul>
        <Separator />
        <div className="font-semibold text-lg font-headline">Route & Schedule</div>
         <ul className="grid gap-3 text-sm">
          <li className="flex items-start justify-between">
            <span className="text-muted-foreground flex items-center gap-2 pt-1">
              <MapPin className="h-4 w-4" /> Pickup
            </span>
            <div className="text-right">
                <p>{load.pickup_city}, {load.pickup_state}</p>
                <p className="text-muted-foreground">{format(parseISO(load.pickup_appointment), "MMM d, h:mm a")}</p>
            </div>
          </li>
           <li className="flex items-start justify-between">
            <span className="text-muted-foreground flex items-center gap-2 pt-1">
              <Flag className="h-4 w-4" /> Delivery
            </span>
            <div className="text-right">
                <p>{load.delivery_city}, {load.delivery_state}</p>
                <p className="text-muted-foreground">{format(parseISO(load.delivery_appointment), "MMM d, h:mm a")}</p>
            </div>
          </li>
           <li className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> ETA
            </span>
            <span className="font-medium">{load.lastEtaISO ? format(parseISO(load.lastEtaISO), "h:mm a") : 'N/A'}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
