"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs sm:text-sm font-medium", className)}
    >
      <ol className="flex items-center space-x-1 md:space-x-2 text-textMuted dark:text-muted-foreground">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center hover:text-primary transition-colors gap-1"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Beranda</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="h-3.5 w-3.5 text-textMuted/40 dark:text-muted-foreground/30 shrink-0 mx-1" />
              {isLast || !item.href ? (
                <span
                  className="font-semibold text-textMain dark:text-foreground max-w-[150px] sm:max-w-none truncate"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors max-w-[150px] sm:max-w-none truncate"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
