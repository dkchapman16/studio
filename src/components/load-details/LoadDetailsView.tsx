import { APIProvider } from "@vis.gl/react-google-maps";
import { Load } from "@/lib/types";
import { MapView } from "./MapView";
import { LoadInfoCard } from "./LoadInfoCard";
import { AlertActionsCard } from "./AlertActionsCard";

interface LoadDetailsViewProps {
    load: Load;
}

// It's recommended to store your API key in an environment variable.
// For example, in a .env.local file:
// NEXT_PUBLIC_GMAPS_KEY=YOUR_API_KEY
// The user prompt specifies GMAPS_KEY from Secret Manager, which would be handled server-side.
// For this client-side component, we rely on a public key.
const API_KEY = process.env.NEXT_PUBLIC_GMAPS_KEY || "";


export function LoadDetailsView({ load }: LoadDetailsViewProps) {
  if (!API_KEY) {
    return (
      <div className="flex items-center justify-center h-96 rounded-lg border border-dashed text-center">
        <p className="text-muted-foreground">
          Google Maps API Key is not configured.<br/>
          Please set the NEXT_PUBLIC_GMAPS_KEY environment variable.
        </p>
      </div>
    )
  }
  
    return (
        <APIProvider apiKey={API_KEY}>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                    <MapView load={load} />
                    {/* Future components like progress timeline can go here */}
                </div>
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
                    <LoadInfoCard load={load} />
                    <AlertActionsCard load={load} />
                </div>
            </div>
        </APIProvider>
    );
}
