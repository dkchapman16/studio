import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Load } from "@/lib/types"
import { AlertTriangle, CheckCircle, ShieldAlert, Truck } from "lucide-react"

interface DashboardStatsProps {
  loads: Load[];
}

export function DashboardStats({ loads }: DashboardStatsProps) {
  const activeLoads = loads.filter(load => load.status === 'dispatched');
  const atRiskCount = activeLoads.filter(load => load.lastStatus === 'AT_RISK').length;
  const watchCount = activeLoads.filter(load => load.lastStatus === 'WATCH').length;
  const okCount = activeLoads.filter(load => load.lastStatus === 'OK').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Loads</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeLoads.length}</div>
          <p className="text-xs text-muted-foreground">Total loads currently in transit</p>
        </CardContent>
      </Card>
      <Card className="border-red-200 dark:border-red-900/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">At Risk</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{atRiskCount}</div>
          <p className="text-xs text-muted-foreground">Loads at risk of being late</p>
        </CardContent>
      </Card>
      <Card className="border-yellow-200 dark:border-yellow-900/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">On Watch</CardTitle>
          <ShieldAlert className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{watchCount}</div>
          <p className="text-xs text-muted-foreground">Loads within buffer time</p>
        </CardContent>
      </Card>
      <Card className="border-green-200 dark:border-green-900/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">On Time</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-500">{okCount}</div>
          <p className="text-xs text-muted-foreground">Loads on schedule</p>
        </CardContent>
      </Card>
    </div>
  )
}
