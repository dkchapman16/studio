import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { LoadList } from "@/components/dashboard/LoadList";
import { placeholderLoads } from "@/lib/placeholder-data";
import { getLoads } from "@/lib/datatruck-service";
import { Load } from "@/lib/types";

export default async function Home() {
  // Fetch data from Datatruck and log it to the console for testing
  const liveLoads = await getLoads();
  console.log("Fetched loads from Datatruck:", liveLoads);

  // We'll continue using placeholder data for the UI for now
  const loads: Load[] = placeholderLoads;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold tracking-tight">Dashboard</h1>
      <DashboardStats loads={loads} />
      <LoadList loads={loads} />
    </div>
  );
}
