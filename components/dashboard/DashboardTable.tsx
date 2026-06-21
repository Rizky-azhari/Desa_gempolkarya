"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DashboardTableProps {
  headers: string[];
  children: React.ReactNode;
  title?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  extraHeaderActions?: React.ReactNode;
  className?: string;
}

export function DashboardTable({
  headers,
  children,
  title,
  searchPlaceholder = "Cari data...",
  searchValue,
  onSearchChange,
  extraHeaderActions,
  className,
}: DashboardTableProps) {
  return (
    <div className={`border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm overflow-hidden flex flex-col ${className || ""}`}>
      {/* Table Toolbar */}
      {(title || onSearchChange || extraHeaderActions) && (
        <div className="px-6 py-5 border-b border-orinoco/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-card">
          {title && (
            <h3 className="font-heading text-base font-extrabold text-textMain dark:text-foreground">
              {title}
            </h3>
          )}

          <div className="flex flex-1 sm:flex-initial items-center gap-3 w-full sm:w-auto ml-auto">
            {onSearchChange && (
              <div className="relative flex-1 sm:w-64 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted dark:text-muted-foreground/60" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue || ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-9 bg-cardSoft hover:bg-cardSoft/80 border-orinoco/20 focus-visible:ring-primary focus-visible:border-primary text-xs font-medium rounded-xl h-9"
                />
              </div>
            )}
            {extraHeaderActions}
          </div>
        </div>
      )}

      {/* Table Viewport */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-cardSoft/50 dark:bg-background/20 font-sans">
            <TableRow className="border-b border-orinoco/10 dark:border-border/40 hover:bg-transparent">
              {headers.map((h, i) => (
                <TableHead
                  key={i}
                  className="text-xs font-semibold text-textMuted dark:text-muted-foreground uppercase tracking-wider h-11 px-6 font-sans"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="font-sans text-xs font-medium text-textMain dark:text-foreground">
            {children}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
