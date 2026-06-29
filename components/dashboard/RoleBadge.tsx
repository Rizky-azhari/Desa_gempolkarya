"use client";

import { UserRole, roleLabels } from "@/lib/roles";
import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const getColors = (r: UserRole) => {
    switch (r) {
      case "super_admin":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50";
      case "admin_desa":
        return "bg-verdun/10 text-verdun border-verdun/20 dark:bg-verdun/20 dark:text-orinoco dark:border-verdun/40";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <Badge
      variant="outline"
      className={`font-medium px-2.5 py-0.5 rounded-full text-xs font-sans tracking-wide border transition-colors ${getColors(role)} ${className || ""}`}
    >
      {roleLabels[role] || role}
    </Badge>
  );
}
