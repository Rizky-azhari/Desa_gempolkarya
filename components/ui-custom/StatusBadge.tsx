"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "info" | "danger" | "neutral";

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  // Define custom styles mapping to theme
  const config = {
    success: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50",
      dot: "bg-emerald-500",
    },
    warning: {
      bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50",
      dot: "bg-amber-500",
    },
    info: {
      bg: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800/50",
      dot: "bg-sky-500",
    },
    danger: {
      bg: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/50",
      dot: "bg-rose-500",
    },
    neutral: {
      bg: "bg-cardSoft text-textMuted border-orinoco/50 dark:bg-card dark:text-muted-foreground dark:border-border",
      dot: "bg-textMuted/60 dark:bg-muted-foreground/60",
    },
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium text-xs font-sans tracking-wide border transition-all",
        config[status].bg,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config[status].dot)} />
      {children}
    </Badge>
  );
}
