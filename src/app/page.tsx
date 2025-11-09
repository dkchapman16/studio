import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { LoadList } from "@/components/dashboard/LoadList";
import { placeholderLoads } from "@/lib/placeholder-data";
import { Load } from "@/lib/types";

export default function Home() {
  const loads: Load[] = placeholderLoads;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold tracking-tight">Dashboard</h1>
      <DashboardStats loads={loads} />
      <LoadList loads={loads} />
    </div>
  );
}
