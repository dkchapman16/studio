import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { LoadStatus } from "@/lib/types"
import { CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react"

interface StatusBadgeProps {
  status: LoadStatus;
  className?: string;
}

const statusConfig = {
  OK: {
    label: "OK",
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800",
  },
  WATCH: {
    label: "Watch",
    icon: ShieldAlert,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800",
  },
  AT_RISK: {
    label: "At Risk",
    icon: AlertTriangle,
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.OK;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.5 whitespace-nowrap",
        config.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </Badge>
  );
}
