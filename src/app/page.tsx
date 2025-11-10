import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { LoadList } from "@/components/dashboard/LoadList";
import { getLoads } from "@/lib/datatruck-service";
import { Load } from "@/lib/types";

export default async function Home() {
  // Fetch data from Datatruck
  const loads: Load[] = await getLoads();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold tracking-tight">Dashboard</h1>
      <DashboardStats loads={loads} />
      <LoadList loads={loads} />
    </div>
  );
}
