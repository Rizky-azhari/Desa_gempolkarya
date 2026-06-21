"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
  className?: string;
}

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendType = "neutral",
  className,
}: DashboardStatCardProps) {
  const getTrendColor = () => {
    if (trendType === "up") return "text-emerald-600 dark:text-emerald-400";
    if (trendType === "down") return "text-rose-600 dark:text-rose-400";
    return "text-textMuted dark:text-muted-foreground";
  };

  return (
    <Card className={`border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 ${className || ""}`}>
      <CardContent className="p-6 flex items-start gap-4">
        {/* Icon wrapper */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary">
          <Icon className="h-5 w-5" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 overflow-hidden min-w-0">
          <span className="text-xs font-semibold text-textMuted dark:text-muted-foreground uppercase tracking-wider font-sans truncate">
            {title}
          </span>
          <span className="font-heading text-2xl md:text-3xl font-extrabold text-textMain dark:text-foreground tracking-tight leading-none">
            {value}
          </span>
          {description && (
            <span className="text-xs text-textMuted/80 dark:text-muted-foreground/75 font-sans truncate mt-0.5">
              {description}
            </span>
          )}
          {trend && (
            <span className={`text-[10px] font-bold font-sans mt-0.5 ${getTrendColor()}`}>
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
