import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { LoadList } from "@/components/dashboard/LoadList";
import { placeholderLoads } from "@/lib/placeholder-data";
import { getLoads } from "@/lib/datatruck-service";
import { Load } from "@/lib/types";

export default async function Home() {
  // Fetch data from Datatruck
  const liveLoads = await getLoads();

  // Combine live data with placeholder data for demonstration
  // In a real application, you might want to only show liveLoads
  const loads: Load[] = [...placeholderLoads, ...liveLoads];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold tracking-tight">Dashboard</h1>
      <DashboardStats loads={loads} />
      <LoadList loads={loads} />
    </div>
  );
}
