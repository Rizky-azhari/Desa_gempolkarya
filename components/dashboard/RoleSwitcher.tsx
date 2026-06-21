"use client";

import { useRole } from "./RoleContext";
import { UserRole, roleLabels } from "@/lib/roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield } from "lucide-react";

export function RoleSwitcher() {
  const { currentRole, setCurrentRole, isLoaded } = useRole();

  if (!isLoaded) {
    return <div className="h-10 w-44 animate-pulse bg-muted rounded-xl" />;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-textMuted dark:text-muted-foreground font-semibold uppercase tracking-wider font-sans">
        <Shield className="h-3.5 w-3.5 text-primary" />
        <span>Role Demo:</span>
      </div>
      <Select
        value={currentRole}
        onValueChange={(val) => setCurrentRole(val as UserRole)}
      >
        <SelectTrigger className="w-[180px] bg-background hover:bg-cardSoft border-orinoco/30 dark:border-border rounded-xl shadow-sm focus:ring-primary focus:border-primary text-xs font-semibold font-sans">
          <SelectValue placeholder="Pilih Role" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-orinoco/20 shadow-md">
          {Object.entries(roleLabels).map(([key, label]) => (
            <SelectItem
              key={key}
              value={key}
              className="text-xs font-medium font-sans cursor-pointer hover:bg-cardSoft py-2 rounded-lg"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
