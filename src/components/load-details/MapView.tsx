"use client";

import { Map, Marker, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Card, CardContent } from "@/components/ui/card";
import { Load } from "@/lib/types";
import { Truck, Flag, MapPin } from "lucide-react";

interface MapViewProps {
  load: Load;
}

export function MapView({ load }: MapViewProps) {
  const centerPosition = load.driver_location || load.delivery_coords;

  return (
    <Card>
      <CardContent className="p-0">
        <div style={{ height: "500px", width: "100%" }}>
          <Map
            defaultZoom={8}
            defaultCenter={centerPosition}
            mapId="hitched-map"
            className="rounded-lg"
          >
            <AdvancedMarker position={load.pickup_coords} title={"Pickup"}>
                <MapPin className="text-muted-foreground h-8 w-8" />
            </AdvancedMarker>
            <AdvancedMarker position={load.delivery_coords} title={"Delivery"}>
                <Flag className="text-primary h-8 w-8" />
            </AdvancedMarker>
            {load.driver_location && (
              <AdvancedMarker position={load.driver_location} title={"Driver"}>
                <div className="p-2 bg-primary rounded-full shadow-lg">
                    <Truck className="text-primary-foreground h-6 w-6" />
                </div>
              </AdvancedMarker>
            )}
          </Map>
        </div>
      </CardContent>
    </Card>
  );
}
